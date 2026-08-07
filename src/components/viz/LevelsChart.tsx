"use client";

// Levels view for the classifier tool: the same four estimates the quadrant
// chart summarises (H₁, H₂, E₁, E₂), drawn as raw counts over the two
// comparison periods instead of as trends. Each series is a slope from T₁ to
// T₂ with its 95% uncertainty band — the band is the classifier's log-normal
// interval [X / u, X · u], so a wide band here is exactly what pushes draws
// into Unclassifiable over there.
//
// The dots and band edges are draggable: dragging a dot edits that period's
// estimate, dragging a cap edits the series' uncertainty factor. Both write
// back through callbacks, so the number inputs stay the source of truth.
//
// Same 500 × 420 viewBox as QuadrantChart so swapping views never reflows
// the page.

import { useEffect, useMemo, useRef, useState } from "react";

const W = 500;
const H = 420;
const PAD = { top: 34, right: 20, bottom: 46, left: 74 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const PLOT_BOTTOM = PAD.top + PLOT_H;
// Periods sit well inside the plot so each endpoint label has a gutter to
// read into — values sit left of T₁ and right of T₂.
const X1 = PAD.left + PLOT_W * 0.22;
const X2 = PAD.left + PLOT_W * 0.76;

// Harm and exposure routinely overlap, so each series is dodged sideways off
// the period line as a whole — dot, slope, band and whisker share one x, and
// the two series stay legibly apart.
const SERIES_GAP = 16;
const LABEL_GAP = 13; // minimum vertical spacing between stacked labels
const WHISKER_CAP = 4;
// Endpoint labels clear the outermost dodged whisker cap.
const LABEL_INSET = SERIES_GAP / 2 + WHISKER_CAP + 8;

const MIN_COUNT = 1;
const DOT_HIT = 11;
const CAP_HIT_W = 18;
const CAP_HIT_H = 14;

export type LevelsKey = "harm" | "exposure";
export type LevelsPeriod = 1 | 2;

export type LevelsSeries = {
  key: LevelsKey;
  /** Symbol used for the endpoint labels — "H" or "E". */
  short: string;
  /** Legend text. */
  label: string;
  color: string;
  v1: number;
  v2: number;
  /** 95% interval bounds at each period. */
  lo1: number;
  hi1: number;
  lo2: number;
  hi2: number;
};

export type LevelsScale = "linear" | "log";

type Handle =
  | { kind: "value"; key: LevelsKey; period: LevelsPeriod }
  | { kind: "bound"; key: LevelsKey; period: LevelsPeriod; edge: "hi" | "lo" };

// ── scale ───────────────────────────────────────────────────────────────────

type Domain = {
  ticks: number[];
  toY: (v: number) => number;
  toValue: (y: number) => number;
};

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/** Smallest "nice" step (1/2/2.5/5 × 10ⁿ) that fits `target` ticks under max. */
function niceStep(max: number, target: number): number {
  if (!Number.isFinite(max) || max <= 0) return 1;
  const rough = max / target;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = NICE_STEPS.find((s) => s * mag >= rough) ?? 10;
  return step * mag;
}

function linearTicks(max: number): number[] {
  const step = niceStep(max, 4);
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = 0; v <= top + step * 1e-9; v += step) out.push(v);
  return out;
}

function logTicks(lo: number, hi: number): number[] {
  const from = Math.floor(Math.log10(lo));
  const to = Math.max(from + 1, Math.ceil(Math.log10(hi)));
  const span = to - from;
  // One tick per decade until that gets crowded, then every 2nd/3rd decade.
  const every = span <= 6 ? 1 : span <= 12 ? 2 : 3;
  const out: number[] = [];
  for (let e = from; e <= to; e += every) out.push(Math.pow(10, e));
  const last = Math.pow(10, to);
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

function computeDomain(series: LevelsSeries[], scale: LevelsScale): Domain {
  const finite = series
    .flatMap((s) => [s.lo1, s.lo2, s.hi1, s.hi2, s.v1, s.v2])
    .filter((v) => Number.isFinite(v) && v > 0);
  const dataHi = finite.length ? Math.max(...finite) : 1;
  const dataLo = finite.length ? Math.min(...finite) : 1;

  if (scale === "log") {
    const ticks = logTicks(dataLo, dataHi);
    const yMin = ticks[0];
    const yMax = ticks[ticks.length - 1];
    const span = Math.log(yMax) - Math.log(yMin) || 1;
    return {
      ticks,
      toY: (v) => PLOT_BOTTOM - ((Math.log(Math.max(v, 1e-9)) - Math.log(yMin)) / span) * PLOT_H,
      toValue: (y) => yMin * Math.exp(((PLOT_BOTTOM - y) / PLOT_H) * span),
    };
  }

  const ticks = linearTicks(dataHi);
  const yMax = ticks[ticks.length - 1] || 1;
  return {
    ticks,
    toY: (v) => PLOT_BOTTOM - (v / yMax) * PLOT_H,
    toValue: (y) => ((PLOT_BOTTOM - y) / PLOT_H) * yMax,
  };
}

// ── formatting ──────────────────────────────────────────────────────────────

/** Compact count label: 12,000,000 → "12M", 2,400,000 → "2.4M". */
export function formatCount(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const abs = Math.abs(v);
  const unit = abs >= 1e9 ? 1e9 : abs >= 1e6 ? 1e6 : abs >= 1e3 ? 1e3 : 1;
  const suffix = unit === 1e9 ? "B" : unit === 1e6 ? "M" : unit === 1e3 ? "k" : "";
  const n = v / unit;
  const digits = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : 2;
  return `${Number(n.toFixed(digits))}${suffix}`;
}

/** Counts round to 3 significant figures — smooth to drag, tidy in the input. */
function roundCount(v: number): number {
  const safe = Math.max(MIN_COUNT, v);
  const mag = Math.pow(10, Math.floor(Math.log10(safe)) - 2);
  return Math.round(safe / mag) * mag;
}

const roundFactor = (v: number) => Math.max(1, Math.round(v * 100) / 100);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Nudge labels apart so two near-equal values never overprint each other. */
function spreadLabels<T extends { y: number }>(items: T[]): T[] {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  return sorted.reduce<T[]>((acc, item) => {
    const prev = acc[acc.length - 1];
    const y = prev && item.y - prev.y < LABEL_GAP ? prev.y + LABEL_GAP : item.y;
    return [...acc, { ...item, y }];
  }, []);
}

// ── component ───────────────────────────────────────────────────────────────

export function LevelsChart({
  series,
  scale,
  svgClassName,
  onValueChange,
  onUncertaintyChange,
}: {
  series: LevelsSeries[];
  scale: LevelsScale;
  svgClassName?: string;
  /** Drag/keyboard edit of one period's point estimate. */
  onValueChange?: (key: LevelsKey, period: LevelsPeriod, value: number) => void;
  /** Drag of a band edge — one factor per series, shared across periods. */
  onUncertaintyChange?: (key: LevelsKey, factor: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<Handle | null>(null);
  // The axis domain is derived from the data, so it would chase the cursor
  // mid-drag. Freeze it for the duration and let the point clamp instead.
  const [frozen, setFrozen] = useState<Domain | null>(null);

  const live = useMemo(() => computeDomain(series, scale), [series, scale]);
  const domain = frozen ?? live;

  const interactive = Boolean(onValueChange || onUncertaintyChange);

  const clampY = (v: number) => clamp(domain.toY(v), PAD.top, PLOT_BOTTOM);
  // Series are dodged symmetrically around each period line.
  const dodge = (i: number) => (i - (series.length - 1) / 2) * SERIES_GAP;

  const placed = series.map((s, i) => {
    const dx = dodge(i);
    return {
      s,
      i,
      x1: X1 + dx,
      x2: X2 + dx,
      y1: clampY(s.v1),
      y2: clampY(s.v2),
      lo1: clampY(s.lo1),
      hi1: clampY(s.hi1),
      lo2: clampY(s.lo2),
      hi2: clampY(s.hi2),
    };
  });

  // Endpoint labels are de-collided per side, independently of the dots.
  const leftLabels = spreadLabels(placed.map((p) => ({ key: p.s.key, y: p.y1, p })));
  const rightLabels = spreadLabels(placed.map((p) => ({ key: p.s.key, y: p.y2, p })));

  // ── editing ───────────────────────────────────────────────────────────────

  const commit = (handle: Handle, rawValue: number) => {
    const s = series.find((x) => x.key === handle.key);
    if (!s) return;
    const value = roundCount(rawValue);
    if (handle.kind === "value") {
      onValueChange?.(s.key, handle.period, value);
      return;
    }
    const center = handle.period === 1 ? s.v1 : s.v2;
    if (!(center > 0)) return;
    const ratio = handle.edge === "hi" ? value / center : center / value;
    onUncertaintyChange?.(s.key, roundFactor(ratio));
  };

  // The SVG scales uniformly (no letterboxing), so client → user space is a
  // straight ratio off the rendered height.
  const toUserY = (clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return PLOT_BOTTOM;
    return ((clientY - rect.top) / rect.height) * H;
  };

  const beginDrag = (handle: Handle) => (e: React.PointerEvent<SVGElement>) => {
    if (!interactive) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFrozen(live);
    setDrag(handle);
  };

  // Every commit re-runs the 20k-draw classifier upstream, so coalesce moves
  // to one commit per frame — high-rate pointers fire well above 60 Hz.
  const pendingY = useRef<number | null>(null);
  const frame = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    pendingY.current = e.clientY;
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const clientY = pendingY.current;
      if (clientY === null) return;
      const y = clamp(toUserY(clientY), PAD.top, PLOT_BOTTOM);
      commit(drag, domain.toValue(y));
    });
  };

  const endDrag = () => {
    if (!drag) return;
    pendingY.current = null;
    setDrag(null);
    setFrozen(null);
  };

  const onHandleKeyDown =
    (key: LevelsKey, period: LevelsPeriod, value: number) => (e: React.KeyboardEvent) => {
      if (!onValueChange) return;
      const step = e.shiftKey ? 0.1 : 0.02;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        onValueChange(key, period, roundCount(value * (1 + step)));
      } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        onValueChange(key, period, roundCount(value * (1 - step)));
      }
    };

  return (
    <div className="w-full max-w-[560px]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={`block w-full h-auto ${svgClassName ?? ""} ${drag ? "select-none" : ""}`}
        // role="img" would make the subtree presentational, hiding the drag
        // handles from assistive tech — group keeps them reachable.
        role={interactive ? "group" : "img"}
        aria-labelledby="levels-title levels-desc"
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <title id="levels-title">
          Harm and exposure counts in period 1 and period 2, with uncertainty bands.
        </title>
        <desc id="levels-desc">
          {series
            .map(
              (s) =>
                `${s.label}: ${formatCount(s.v1)} at T₁ (range ${formatCount(s.lo1)} to ${formatCount(
                  s.hi1,
                )}), ${formatCount(s.v2)} at T₂ (range ${formatCount(s.lo2)} to ${formatCount(s.hi2)}).`,
            )
            .join(" ")}
        </desc>

        {/* Legend */}
        {series.map((s, i) => (
          <g key={s.key} transform={`translate(${PAD.left + i * 132} ${PAD.top - 16})`}>
            <line x1={0} x2={16} y1={-4} y2={-4} stroke={s.color} strokeWidth={2} />
            <text
              x={22}
              y={0}
              fontFamily="var(--font-jetbrains-mono)"
              className="fill-ink-soft text-[15px] md:text-[10px]"
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* Y gridlines + ticks */}
        {domain.ticks.map((t) => {
          const y = domain.toY(t);
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={PAD.left + PLOT_W}
                y1={y}
                y2={y}
                stroke="var(--rule)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y + 3.5}
                textAnchor="end"
                fontFamily="var(--font-jetbrains-mono)"
                className="fill-ink-faint text-[15px] md:text-[10px]"
              >
                {formatCount(t)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top - 6}
          y2={PLOT_BOTTOM}
          stroke="var(--ink-faint)"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          x2={PAD.left + PLOT_W}
          y1={PLOT_BOTTOM}
          y2={PLOT_BOTTOM}
          stroke="var(--ink-faint)"
          strokeWidth={1}
        />

        {/* Period guides */}
        {[X1, X2].map((x, i) => (
          <g key={x}>
            <line
              x1={x}
              x2={x}
              y1={PAD.top - 6}
              y2={PLOT_BOTTOM}
              stroke="var(--rule)"
              strokeDasharray="3 4"
              strokeWidth={1}
            />
            <text
              x={x}
              y={PLOT_BOTTOM + 22}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono)"
              className="fill-ink-soft text-[16px] md:text-[11px]"
            >
              {i === 0 ? "T₁" : "T₂"}
            </text>
          </g>
        ))}

        {/* Uncertainty bands, then the point-estimate slopes on top. */}
        {placed.map(({ s, x1, x2, hi1, hi2, lo1, lo2 }) => (
          <polygon
            key={`band-${s.key}`}
            points={`${x1},${hi1} ${x2},${hi2} ${x2},${lo2} ${x1},${lo1}`}
            fill={s.color}
            fillOpacity={0.1}
            stroke={s.color}
            strokeOpacity={0.35}
            strokeWidth={1}
          />
        ))}

        {placed.map(({ s, x1, x2, y1, y2, lo1, hi1, lo2, hi2 }) => (
          <g key={`line-${s.key}`}>
            {[
              { x: x1, lo: lo1, hi: hi1 },
              { x: x2, lo: lo2, hi: hi2 },
            ].map(({ x, lo, hi }) => (
              <g key={x} stroke={s.color} strokeOpacity={0.7} strokeWidth={1.25}>
                <line x1={x} x2={x} y1={hi} y2={lo} />
                <line x1={x - WHISKER_CAP} x2={x + WHISKER_CAP} y1={hi} y2={hi} />
                <line x1={x - WHISKER_CAP} x2={x + WHISKER_CAP} y1={lo} y2={lo} />
              </g>
            ))}
            <line x1={x1} x2={x2} y1={y1} y2={y2} stroke={s.color} strokeWidth={2.25} />
            <circle cx={x1} cy={y1} r={3.5} fill={s.color} />
            <circle cx={x2} cy={y2} r={3.5} fill={s.color} />
          </g>
        ))}

        {/* Endpoint labels */}
        {leftLabels.map(({ key, y, p }) => (
          <text
            key={`l-${key}`}
            x={X1 - LABEL_INSET}
            y={y + 3.5}
            textAnchor="end"
            fontFamily="var(--font-jetbrains-mono)"
            className="text-[13px] md:text-[10px]"
            fill={p.s.color}
          >
            {`${p.s.short}₁ ${formatCount(p.s.v1)}`}
          </text>
        ))}
        {rightLabels.map(({ key, y, p }) => (
          <text
            key={`r-${key}`}
            x={X2 + LABEL_INSET}
            y={y + 3.5}
            fontFamily="var(--font-jetbrains-mono)"
            className="text-[13px] md:text-[10px]"
            fill={p.s.color}
          >
            {`${p.s.short}₂ ${formatCount(p.s.v2)}`}
          </text>
        ))}

        {/* ── Drag handles ─────────────────────────────────────────────────
            Invisible hit targets, band edges first so the dots win where the
            two overlap. The caps are pointer-only: u_H and u_E already have
            keyboard-reachable number inputs beside the chart. */}
        {interactive
          ? placed.map(({ s, x1, x2, y1, y2, lo1, hi1, lo2, hi2 }) => (
              <g key={`handles-${s.key}`}>
                {onUncertaintyChange
                  ? (
                      [
                        { period: 1 as LevelsPeriod, edge: "hi" as const, x: x1, y: hi1 },
                        { period: 1 as LevelsPeriod, edge: "lo" as const, x: x1, y: lo1 },
                        { period: 2 as LevelsPeriod, edge: "hi" as const, x: x2, y: hi2 },
                        { period: 2 as LevelsPeriod, edge: "lo" as const, x: x2, y: lo2 },
                      ] as const
                    ).map(({ period, edge, x, y }) => (
                      <rect
                        key={`${period}-${edge}`}
                        x={x - CAP_HIT_W / 2}
                        y={y - CAP_HIT_H / 2}
                        width={CAP_HIT_W}
                        height={CAP_HIT_H}
                        fill="transparent"
                        style={{ cursor: "ns-resize", touchAction: "none" }}
                        onPointerDown={beginDrag({ kind: "bound", key: s.key, period, edge })}
                      >
                        <title>{`Drag to change the ${s.label} uncertainty factor`}</title>
                      </rect>
                    ))
                  : null}
                {onValueChange
                  ? (
                      [
                        { period: 1 as LevelsPeriod, x: x1, y: y1, v: s.v1 },
                        { period: 2 as LevelsPeriod, x: x2, y: y2, v: s.v2 },
                      ] as const
                    ).map(({ period, x, y, v }) => (
                      <circle
                        key={period}
                        cx={x}
                        cy={y}
                        r={DOT_HIT}
                        fill="transparent"
                        strokeWidth={2}
                        style={{ cursor: "ns-resize", touchAction: "none" }}
                        tabIndex={0}
                        role="slider"
                        aria-label={`${s.label} in period ${period}`}
                        aria-valuenow={Number.isFinite(v) ? v : undefined}
                        aria-valuetext={formatCount(v)}
                        // outline on SVG is unreliable across browsers; the
                        // hit circle's own stroke is the focus ring.
                        className="outline-none stroke-transparent focus-visible:stroke-accent-text"
                        onPointerDown={beginDrag({ kind: "value", key: s.key, period })}
                        onKeyDown={onHandleKeyDown(s.key, period, v)}
                      >
                        <title>{`Drag to change ${s.short}${period === 1 ? "₁" : "₂"}`}</title>
                      </circle>
                    ))
                  : null}
              </g>
            ))
          : null}

        {/* Axis titles */}
        <g transform={`rotate(-90 ${PAD.left - 46} ${PAD.top + PLOT_H / 2})`}>
          <text
            x={PAD.left - 46}
            y={PAD.top + PLOT_H / 2}
            textAnchor="middle"
            fontFamily="var(--font-jetbrains-mono)"
            className="fill-ink-soft text-[16px] md:text-[10px]"
          >
            {/* The legend names both series, so the axis only needs the unit
                — the long form crowds the plot at the mobile type size. */}
            {scale === "log" ? "count · log scale ↑" : "count ↑"}
          </text>
        </g>
        <text
          x={PAD.left + PLOT_W}
          y={PLOT_BOTTOM + 38}
          textAnchor="end"
          fontFamily="var(--next-font-heading)"
          fontStyle="italic"
          className="fill-ink-faint text-[16px] md:text-[10px]"
        >
          comparison period
        </text>
      </svg>
    </div>
  );
}

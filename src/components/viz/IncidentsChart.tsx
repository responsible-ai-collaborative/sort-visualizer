"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { resolveAct1 } from "@/lib/step-config";
import incidentCountsRaw from "@/lib/incident-counts.json";
import { FrameworkFlow } from "@/components/viz/FrameworkFlow";

gsap.registerPlugin(useGSAP);

// Monthly AI incident and hazard counts exported from the OECD AI Incidents
// and Hazards Monitor (AIM), 2020-12 → 2025-12. Regenerated from the
// tmp/aim-*.csv exports; incidents + hazards sums to AIM's combined series.
type IncidentRow = { ym: string; incidents: number; hazards: number };
const MONTHS: IncidentRow[] = incidentCountsRaw as IncidentRow[];
const N = MONTHS.length;

function rollingAvg(values: number[], window: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

const TOTALS = MONTHS.map((m) => m.incidents + m.hazards);
const INCIDENT_AVG = rollingAvg(
  MONTHS.map((m) => m.incidents),
  6,
);
const HAZARD_AVG = rollingAvg(
  MONTHS.map((m) => m.hazards),
  6,
);

const MAX_Y = Math.ceil(Math.max(...TOTALS) / 50) * 50 + 50;

// Build sensible y-axis ticks from MAX_Y (e.g. 650 → [0, 250, 500]).
const Y_TICK_STEP = Math.ceil(MAX_Y / 3 / 50) * 50;
const yTicks = [0, Y_TICK_STEP, Y_TICK_STEP * 2, Y_TICK_STEP * 3].filter((v) => v <= MAX_Y);

const H = 360;

// Two viewBox geometries. Wide reserves right padding for the step-1.2
// annotations, which sit beside the plot ("More harm per use?" ends at
// ~x=584 — the svg clips at the viewBox edge, so W must exceed it). Narrow
// drops that gutter so the plot fills the available width; the annotations
// then render elsewhere (below the chart on mid-size screens, inside the
// plot's empty top-left corner on mobile).
function buildGeom(W: number, padRight: number) {
  // bottom = tick line (4) + year-label baseline (+18) + descenders/margin.
  const PAD = { top: 28, right: padRight, bottom: 30, left: 56 };
  const PLOT_W = W - PAD.left - PAD.right;
  const PLOT_H = H - PAD.top - PAD.bottom;

  const x = (i: number) => PAD.left + (i / (N - 1)) * PLOT_W;
  const y = (v: number) => PAD.top + PLOT_H - (v / MAX_Y) * PLOT_H;

  const linePath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");

  return {
    W,
    PAD,
    PLOT_W,
    PLOT_H,
    x,
    y,
    barW: PLOT_W / N - 1.2,
    incidentsPath: linePath(INCIDENT_AVG),
    hazardPath: linePath(HAZARD_AVG),
    launchX: x(MONTHS.findIndex((m) => m.ym === "2022-12")),
    // One tick per January present in the data.
    yearTicks: MONTHS.flatMap((m, i) =>
      m.ym.endsWith("-01") ? [{ label: m.ym.slice(0, 4), x: x(i) }] : [],
    ),
    // Width of one month's invisible hover strip (full plot height, centered
    // on the bar) — generous hit target, no pixel-hunting for the tooltip.
    hoverCellW: PLOT_W / (N - 1),
  };
}

const GEOM_WIDE = buildGeom(600, 140);
const GEOM_NARROW = buildGeom(470, 16);

const ANNOTATIONS = ["More deployment?", "More reporting?", "More harm per use?"];

// Three layout bands. "mobile" (<768px, the ScrollySection stacked mode):
// narrow geometry, annotations inside the plot. "mid" (768–1239px, two
// columns but the viz column still shrinking): narrow geometry so the plot
// uses the annotation gutter's space, annotations in a row below the chart.
// "desktop" (≥1240px, the section container at its max width): wide geometry
// with the annotations beside the plot.
type LayoutBand = "mobile" | "mid" | "desktop";
const MOBILE_QUERY = "(max-width: 767px)"; // Tailwind `md`, as ScrollySection
const DESKTOP_QUERY = "(min-width: 1240px)"; // ScrollySection max-w-[1240px]
function subscribeToLayout(cb: () => void) {
  const mqs = [window.matchMedia(MOBILE_QUERY), window.matchMedia(DESKTOP_QUERY)];
  mqs.forEach((mq) => mq.addEventListener("change", cb));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", cb));
}
function getLayoutBand(): LayoutBand {
  if (window.matchMedia(MOBILE_QUERY).matches) return "mobile";
  if (window.matchMedia(DESKTOP_QUERY).matches) return "desktop";
  return "mid";
}
function useLayoutBand(): LayoutBand {
  return useSyncExternalStore(subscribeToLayout, getLayoutBand, () => "desktop");
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatYm(ym: string): string {
  const [year, month] = ym.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

export function IncidentsChart({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct1(activeStep);
  const reduced = !!useReducedMotion();
  const layout = useLayoutBand();
  const mobile = layout === "mobile";
  const g = layout === "desktop" ? GEOM_WIDE : GEOM_NARROW;
  const containerRef = useRef<HTMLDivElement>(null);
  const incidentsLineRef = useRef<SVGPathElement>(null);
  const hazardLineRef = useRef<SVGPathElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Step 1.1 — chart appears: bars stagger up, lines draw on. The natural
  // (un-animated) DOM state is the fully-visible chart, and `revertOnUpdate`
  // restores it whenever a dependency change kills the context — an
  // interrupted entrance can therefore never strand the chart at partial
  // scale/opacity (which used to happen when snap-scrolling toggled
  // state.chart mid-tween). Reduced motion: skip entirely, natural state is
  // already final (the CSS media query does not cover GSAP tweens).
  useGSAP(
    () => {
      if (!state.chart || reduced) return;

      // Bar stagger: scaleY from bottom. We use SVG transforms via attr since
      // CSS transforms on inner SVG nodes are inconsistent across browsers.
      gsap.from(".inc-bar", {
        scaleY: 0,
        transformOrigin: "center bottom",
        duration: 0.55,
        stagger: { each: 0.008, from: "start" },
        ease: "power2.out",
      });

      // Draw-on lines via stroke-dashoffset. We measure the path length at
      // animate time so it's correct regardless of viewport. `fromTo` (not
      // `from`) because the dasharray must be applied for the effect at all.
      for (const [path, duration, delay] of [
        [incidentsLineRef.current, 2.4, 0.5],
        [hazardLineRef.current, 2.0, 0.9],
      ] as const) {
        if (!path) continue;
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration,
            ease: "power2.out",
            delay,
            // Drop the inline dash overrides once drawn so the hazard path's
            // own strokeDasharray="4 3" (the dashed look) shows again.
            onComplete: () => gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }),
          },
        );
      }

      gsap.from(".inc-launch", { opacity: 0, duration: 0.6, delay: 1.4 });

      gsap.from(".inc-legend", { opacity: 0, y: -4, duration: 0.45, delay: 0.2 });
    },
    { scope: containerRef, dependencies: [state.chart, reduced], revertOnUpdate: true },
  );

  // Step 1.2 — annotations: each label slides in from the right with stagger.
  // Same natural-state-is-final contract as the entrance above.
  useGSAP(
    () => {
      if (!state.annotations || reduced) return;
      gsap.from(".inc-anno", {
        opacity: 0,
        x: 12,
        duration: 0.55,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope: containerRef, dependencies: [state.annotations, reduced], revertOnUpdate: true },
  );

  // Step 1.3 pipeline entrance and dock morph are handled by SortPipeline (Framer Motion).

  const titleText = state.pipeline
    ? "Monthly AI incident and hazard reports 2020–2025, with the framework pipeline that separates exposure from harm."
    : state.annotations
      ? "Monthly AI incident and hazard reports 2020–2025 with three competing interpretations of the rising trend."
      : "Monthly AI incident and hazard reports 2020–2025 — total counts climbing.";

  const hoverData =
    state.chart && hovered !== null ? { index: hovered, month: MONTHS[hovered] } : null;
  // Tooltip x as a fraction of chart width; the matching -x% translateX keeps
  // the tooltip fully inside the chart box even at the first/last bars.
  const hoverXPct = hoverData ? (g.x(hoverData.index) / g.W) * 100 : 0;

  return (
    // data-viz-obscures-caption hides the sibling figcaption (see globals.css)
    // while the pipeline overlay covers the chart — the caption describes the
    // bars, and the flow diagram is taller and would collide with it.
    <div
      ref={containerRef}
      data-viz-obscures-caption={state.pipeline || undefined}
      className="relative w-full max-w-[680px] md:min-h-[440px]"
    >
      <div
        className={
          "transition-opacity duration-500 ease-out " +
          (state.pipeline ? "opacity-0 pointer-events-none max-md:hidden" : "opacity-100")
        }
      >
        {state.chart && (
          <div
            className="inc-legend mb-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-[12px] text-ink-soft max-md:justify-center"
            style={{
              paddingLeft: mobile ? undefined : `${((g.PAD.left / g.W) * 100).toFixed(1)}%`,
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-[2px] w-4 align-middle"
                style={{ background: "var(--accent)" }}
              />
              <span>Incidents (6-mo avg)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-[2px] w-4 align-middle border-b border-dashed"
                style={{ borderColor: "var(--ink-soft)", background: "transparent" }}
              />
              <span>Hazards (6-mo avg)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2 w-4 align-middle"
                style={{ background: "var(--rule)", opacity: 0.7 }}
              />
              <span>Total (monthly)</span>
            </span>
          </div>
        )}
        <div className="relative">
          {/* Below md the svg is sized by height (pin height minus legend
              room) with width following the aspect ratio — sizing by width
              would overflow the 40vh pin on wide-but-short small screens. */}
          <svg
            viewBox={`0 0 ${g.W} ${H}`}
            className="w-full h-auto max-md:h-[calc(40vh-60px)] max-md:w-auto max-md:max-w-full mx-auto"
            role="img"
            aria-labelledby="incidents-title incidents-desc"
          >
            <title id="incidents-title">{titleText}</title>
            <desc id="incidents-desc">
              A bar-and-line chart showing monthly AI incident and hazard counts from December 2020
              to December 2025, climbing from a couple dozen per month early on to totals above five
              hundred per month by late 2025, with a clear inflection after the ChatGPT launch in
              December 2022. Hovering a bar reveals that month&apos;s exact counts.
            </desc>

            {/* y-axis grid */}
            {yTicks.map((v) => (
              <g key={v}>
                <line
                  x1={g.PAD.left}
                  x2={g.PAD.left + g.PLOT_W}
                  y1={g.y(v)}
                  y2={g.y(v)}
                  stroke="var(--rule)"
                  strokeWidth={0.6}
                  strokeDasharray={v === 0 ? "" : "1 3"}
                />
                <text
                  x={g.PAD.left - 8}
                  y={g.y(v) + 3.5}
                  textAnchor="end"
                  className="fill-ink-faint"
                  fontFamily="var(--font-jetbrains-mono)"
                  fontSize="10"
                >
                  {v}
                </text>
              </g>
            ))}
            <text
              x={g.PAD.left - 38}
              y={g.PAD.top - 12}
              className="fill-ink-faint"
              fontFamily="var(--font-jetbrains-mono)"
              fontSize="10"
              letterSpacing="0.08em"
            >
              count / month
            </text>

            {/* x-axis ticks */}
            {g.yearTicks.map((t) => (
              <g key={t.label}>
                <line
                  x1={t.x}
                  x2={t.x}
                  y1={g.PAD.top + g.PLOT_H}
                  y2={g.PAD.top + g.PLOT_H + 4}
                  stroke="var(--rule)"
                  strokeWidth={0.6}
                />
                <text
                  x={t.x}
                  y={g.PAD.top + g.PLOT_H + 18}
                  textAnchor="middle"
                  className="fill-ink-faint"
                  fontFamily="var(--font-jetbrains-mono)"
                  fontSize="10"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {/* Monthly bars — each is its own rect so GSAP can stagger them. */}
            {state.chart &&
              MONTHS.map((m, i) => (
                <rect
                  key={m.ym}
                  className="inc-bar"
                  x={g.x(i) - g.barW / 2}
                  y={g.y(m.incidents + m.hazards)}
                  width={g.barW}
                  height={g.PAD.top + g.PLOT_H - g.y(m.incidents + m.hazards)}
                  fill={hovered === i ? "var(--accent-soft)" : "var(--rule)"}
                  opacity={hovered === i ? 0.95 : 0.55}
                />
              ))}

            {/* Incidents 6-mo avg line */}
            {state.chart && (
              <path
                ref={incidentsLineRef}
                d={g.incidentsPath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.6}
              />
            )}

            {/* Hazards 6-mo avg dashed line */}
            {state.chart && (
              <path
                ref={hazardLineRef}
                d={g.hazardPath}
                fill="none"
                stroke="var(--ink-soft)"
                strokeWidth={1.2}
                strokeDasharray="4 3"
              />
            )}

            {/* ChatGPT launch rule */}
            {state.chart && (
              <g className="inc-launch">
                <line
                  x1={g.launchX}
                  x2={g.launchX}
                  y1={g.PAD.top}
                  y2={g.PAD.top + g.PLOT_H}
                  stroke="var(--ink-faint)"
                  strokeWidth={0.8}
                  strokeDasharray="2 2"
                />
                <text
                  x={g.launchX + 4}
                  y={g.PAD.top + 10}
                  className="fill-ink-faint"
                  fontFamily="var(--next-font-heading)"
                  fontStyle="italic"
                  fontSize="11"
                >
                  ChatGPT launch
                </text>
              </g>
            )}

            {/* Three competing interpretations (step 1.2). Desktop: in the
                right gutter beside the plot. Mobile: stacked in the plot's
                empty top-left corner (early months are all low counts).
                Mid-size: rendered as an HTML row below the chart instead. */}
            {state.annotations && layout !== "mid" && (
              <g
                fontFamily="var(--next-font-body)"
                fontStyle="italic"
                fontSize={mobile ? "12" : "13"}
                className="fill-note"
              >
                {ANNOTATIONS.map((label, k) => (
                  <text
                    key={label}
                    className="inc-anno"
                    x={mobile ? g.PAD.left + 8 : g.PAD.left + g.PLOT_W + 8}
                    y={mobile ? g.PAD.top + 16 + k * 17 : g.PAD.top + 30 + k * 80}
                  >
                    {label}
                  </text>
                ))}
              </g>
            )}

            {/* Invisible full-height hover strips, one per month, drawn last so
              they sit above the bars/lines and drive the tooltip. */}
            {state.chart && (
              <g aria-hidden onMouseLeave={() => setHovered(null)}>
                {MONTHS.map((m, i) => (
                  <rect
                    key={m.ym}
                    x={g.x(i) - g.hoverCellW / 2}
                    y={g.PAD.top}
                    width={g.hoverCellW}
                    height={g.PLOT_H}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                  />
                ))}
              </g>
            )}
          </svg>

          {/* Tooltip — HTML overlay anchored to the hovered month's bar tip.
            Percent coordinates track the responsive SVG scaling. */}
          {hoverData && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-10 border border-rule bg-white px-3 py-2 whitespace-nowrap font-body text-[12px] leading-[1.5] text-ink-soft shadow-[0_2px_10px_rgba(1,25,52,0.10)]"
              style={{
                left: `${hoverXPct.toFixed(2)}%`,
                top: `${((g.y(hoverData.month.incidents + hoverData.month.hazards) / H) * 100).toFixed(2)}%`,
                transform: `translate(-${hoverXPct.toFixed(2)}%, calc(-100% - 10px))`,
              }}
            >
              <div className="font-display italic text-[13px] text-ink mb-1">
                {formatYm(hoverData.month.ym)}
              </div>
              <div className="flex items-baseline justify-between gap-5">
                <span>Incidents</span>
                <span className="font-mono text-ink">{hoverData.month.incidents}</span>
              </div>
              <div className="flex items-baseline justify-between gap-5">
                <span>Hazards</span>
                <span className="font-mono text-ink">{hoverData.month.hazards}</span>
              </div>
              <div className="mt-1 pt-1 border-t border-rule flex items-baseline justify-between gap-5">
                <span>Total</span>
                <span className="font-mono text-ink">
                  {hoverData.month.incidents + hoverData.month.hazards}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mid-size only: the three step-1.2 annotations as a centered row
            tight under the chart — the svg's right gutter is gone in this
            band so the plot can use the full column width. */}
        {state.annotations && layout === "mid" && (
          <div className="flex flex-wrap items-baseline justify-center gap-x-7 gap-y-1 font-body italic text-[14px] text-note">
            {ANNOTATIONS.map((label) => (
              <span key={label} className="inc-anno">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Below md the crossfade overlay becomes in-flow (max-md:static) so
          the taller pipeline diagram sizes the container and stays reachable
          inside the pinned box's own scrolling — and it must be display-none
          (not just opacity-0) when inactive: its taller-than-container
          content otherwise adds invisible scrollable overflow to the
          overflow-y-auto pin, making the chart steps scrollable. */}
      <div
        className={
          "absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out " +
          (state.pipeline
            ? "opacity-100 max-md:static"
            : "opacity-0 pointer-events-none max-md:hidden")
        }
      >
        <FrameworkFlow visible={state.pipeline} />
      </div>
    </div>
  );
}

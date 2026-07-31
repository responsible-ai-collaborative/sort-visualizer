"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Quadrant, ClassificationWeights, TrajectoryCategory } from "@/lib/case-data";
import { quadrantCopy, unclassifiableCopy } from "@/lib/quadrant-copy";

gsap.registerPlugin(useGSAP);

const FADE = { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] as const };

const W = 500;
const H = 420;
const PAD = { top: 28, right: 28, bottom: 56, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const midX = PAD.left + PLOT_W / 2;
const midY = PAD.top + PLOT_H / 2;

// Quadrant layout (E trend on x, Ĥ trend on y):
//                Ĥ ↑
//   Concentrating | Escalating
//   E ↓           | E ↑
//   ────────────────────────────
//   Receding      | Mitigating
//                 Ĥ ↓
const QUADS: {
  key: Quadrant;
  x: number;
  y: number;
  fill: string;
}[] = [
  { key: "concentrating", x: PAD.left, y: PAD.top, fill: "var(--concentrating)" },
  { key: "escalating", x: midX, y: PAD.top, fill: "var(--escalating)" },
  { key: "receding", x: PAD.left, y: midY, fill: "var(--receding)" },
  { key: "mitigating", x: midX, y: midY, fill: "var(--mitigating)" },
];

const halfW = PLOT_W / 2;
const halfH = PLOT_H / 2;

export type DotProps = {
  x: number; // 0..1 across plot
  y: number; // 0..1 across plot (0 = top)
  color: string;
};

// One Monte Carlo draw of the probabilistic classifier, in plot fractions.
export type CloudPoint = {
  x: number;
  y: number;
  category: TrajectoryCategory;
};

const CLOUD_COLORS: Record<TrajectoryCategory, string> = {
  escalating: "var(--escalating)",
  mitigating: "var(--mitigating-deep)",
  concentrating: "var(--concentrating)",
  receding: "var(--receding)",
  unclassifiable: "var(--ink-faint)",
};

const formatWeight = (w: number) => `${(w * 100).toFixed(1)}%`;

export function QuadrantChart({
  activeQuadrant,
  dot,
  weights,
  showVerdict,
  verdictDetail,
  cloud,
  dotAnimated = true,
  svgClassName,
  pillClassName,
}: {
  activeQuadrant: Quadrant | null;
  dot: DotProps | null;
  // Probability weights from the paper's probabilistic classifier; when
  // present, nonzero quadrants get a percentage chip and the unclassifiable
  // mass is rendered as a pill below the chart.
  weights?: ClassificationWeights | null;
  showVerdict?: boolean;
  // Case-specific verdict text; falls back to the generic quadrant summary.
  verdictDetail?: string;
  // Monte Carlo draw cloud (step 4.4 explorer) — faint per-draw points
  // colored by the category each draw classified into.
  cloud?: CloudPoint[] | null;
  // False while sliders drive the dot live: skips the landing animation and
  // keeps the dot mounted so it tracks instead of replaying the ripple.
  dotAnimated?: boolean;
  // Extra classes on the svg — used to cap the chart's height below md so
  // the pill/button that follows it still fits the mobile pin.
  svgClassName?: string;
  // Extra classes on the unclassifiable pill wrapper — the explorer view
  // passes `max-md:hidden` to relocate the share into its own compact row.
  pillClassName?: string;
}) {
  const reduced = useReducedMotion();
  const tDur = reduced ? 0 : FADE.duration;
  const containerRef = useRef<HTMLDivElement>(null);

  const verdictCopy = activeQuadrant ? quadrantCopy[activeQuadrant] : null;

  const dotX = dot ? PAD.left + dot.x * PLOT_W : 0;
  const dotY = dot ? PAD.top + dot.y * PLOT_H : 0;

  // GSAP dot landing: overshoot scale-in with a ripple ring + label fade.
  useGSAP(
    () => {
      if (!dot) return;
      if (reduced || !dotAnimated) {
        gsap.set(".quad-dot-circle", { scale: 1, opacity: 1 });
        gsap.set(".quad-dot-ripple", { opacity: 0 });
        return;
      }
      gsap.set(".quad-dot-circle", { transformOrigin: "center center", scale: 0, opacity: 1 });
      gsap.set(".quad-dot-ripple", { attr: { r: 0 }, opacity: 0.6 });

      const tl = gsap.timeline();
      tl.to(".quad-dot-circle", {
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.7)",
      }).to(
        ".quad-dot-ripple",
        {
          attr: { r: 36 },
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "<",
      );
    },
    {
      scope: containerRef,
      // While live (dotAnimated false) the position deps drop out so slider
      // drags don't re-trigger the effect on every frame.
      dependencies: dotAnimated
        ? [dot?.x, dot?.y, dot?.color, reduced, dotAnimated]
        : [dotAnimated],
    },
  );

  return (
    <div ref={containerRef} className="w-full max-w-[560px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`block w-full h-auto ${svgClassName ?? ""}`}
        role="img"
        aria-labelledby="quad-title quad-desc"
      >
        <title id="quad-title">
          {activeQuadrant
            ? `Trajectory classification quadrant chart with the ${quadrantCopy[activeQuadrant].label} quadrant highlighted.`
            : "Trajectory classification quadrant chart — 2 × 2 grid with four trajectory categories."}
        </title>
        <desc id="quad-desc">
          A two-by-two grid. The horizontal axis is the exposure trend (E), decreasing on the left
          and increasing on the right. The vertical axis is the harm-per-exposure trend (Ĥ),
          decreasing at the bottom and increasing at the top. The four quadrants are Concentrating
          (top-left), Escalating (top-right), Receding (bottom-left), and Mitigating (bottom-right).
        </desc>

        <defs>
          {/* Diagonal hatch used to give the Escalating quadrant a permanent
              "charged" texture — the most urgent cell reads hotter than the
              rest even at rest (reviewer note). */}
          <pattern
            id="hatch-escalating"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--escalating)" strokeWidth="1.1" />
          </pattern>
        </defs>

        {/* Quadrant highlight (back layer) */}
        {QUADS.map((q) => (
          <motion.rect
            key={`hl-${q.key}`}
            x={q.x}
            y={q.y}
            width={halfW}
            height={halfH}
            fill={q.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeQuadrant === q.key ? 0.18 : 0 }}
            transition={{ duration: tDur }}
          />
        ))}

        {/* Escalating's permanent hatch, brighter when it's the active cell. */}
        <rect
          x={midX}
          y={PAD.top}
          width={halfW}
          height={halfH}
          fill="url(#hatch-escalating)"
          style={{ transition: `opacity ${tDur}s` }}
          opacity={activeQuadrant === "escalating" ? 0.24 : 0.1}
        />

        {/* Monte Carlo draw cloud — back layer, beneath gridlines, labels,
            weight chips, and the dot. */}
        {cloud
          ? cloud.map((p, i) => (
              <circle
                key={i}
                cx={PAD.left + p.x * PLOT_W}
                cy={PAD.top + p.y * PLOT_H}
                r={2}
                fill={CLOUD_COLORS[p.category]}
                opacity={0.34}
              />
            ))
          : null}

        {/* Quadrant boundaries */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={PLOT_W}
          height={PLOT_H}
          fill="none"
          stroke="var(--rule)"
          strokeWidth={1}
        />
        <line x1={midX} y1={PAD.top} x2={midX} y2={PAD.top + PLOT_H} stroke="var(--rule)" />
        <line x1={PAD.left} y1={midY} x2={PAD.left + PLOT_W} y2={midY} stroke="var(--rule)" />

        {/* Quadrant labels. Font sizes are set via classes, not attributes:
            CSS px inside an svg resolve to viewBox units, so the max-md
            values counter the ~0.63× scale-down when the 500-unit chart
            renders in a ~320px column — labels stay readable on mobile. */}
        {QUADS.map((q) => {
          const cx = q.x + halfW / 2;
          const cy = q.y + 26;
          const copy = quadrantCopy[q.key];
          const isActive = activeQuadrant === q.key;
          return (
            <text
              key={q.key}
              x={cx}
              y={cy}
              textAnchor="middle"
              fontFamily="var(--next-font-heading)"
              fontStyle="italic"
              fill={isActive ? q.fill : "var(--ink-soft)"}
              className="text-[27px] md:text-[17px]"
            >
              {copy.label}
            </text>
          );
        })}

        {/* Probability-weight chips — centered under each quadrant's heading
            by default; if the case dot encroaches on that spot the chip
            dodges to the quadrant's outer edge at mid-height instead. */}
        <AnimatePresence>
          {weights
            ? QUADS.map((q, i) => {
                const w = weights[q.key] ?? 0;
                // All four quadrants carry a figure. Sub-0.05% cells still show
                // one (so the distribution reads as complete), just small and
                // muted so a near-zero quadrant doesn't look like a headline
                // stat next to the real mass.
                const tiny = w < 0.0005;
                const cx = q.x + halfW / 2;
                const isRight = q.x === midX;
                const dotNearChip =
                  dot !== null && Math.abs(dotX - cx) < 58 && dotY > q.y + 26 && dotY < q.y + 88;
                return (
                  <motion.text
                    key={`w-${q.key}`}
                    x={dotNearChip ? (isRight ? q.x + halfW - 12 : q.x + 12) : cx}
                    y={dotNearChip ? q.y + halfH / 2 + 9 : q.y + 66}
                    textAnchor={dotNearChip ? (isRight ? "end" : "start") : "middle"}
                    fontFamily="var(--next-font-heading)"
                    fontWeight={tiny ? "600" : "700"}
                    className={tiny ? "text-[19px] md:text-[13px]" : "text-[34px] md:text-[24px]"}
                    fill={
                      tiny
                        ? "var(--ink-faint)"
                        : q.key === "mitigating"
                          ? "var(--mitigating-deep)"
                          : q.fill
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: tDur, delay: reduced ? 0 : i * 0.15 }}
                  >
                    {formatWeight(w)}
                  </motion.text>
                );
              })
            : null}
        </AnimatePresence>

        {/* Axes */}
        <text
          x={midX}
          y={PAD.top + PLOT_H + 30}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono)"
          className="fill-ink-soft text-[16px] md:text-[10px]"
        >
          exposure growth →
        </text>
        <text
          x={PAD.left + 8}
          y={PAD.top + PLOT_H + 30}
          textAnchor="start"
          fontFamily="var(--next-font-heading)"
          fontStyle="italic"
          className="fill-ink-faint text-[16px] md:text-[10px]"
        >
          decreasing
        </text>
        <text
          x={PAD.left + PLOT_W - 8}
          y={PAD.top + PLOT_H + 30}
          textAnchor="end"
          fontFamily="var(--next-font-heading)"
          fontStyle="italic"
          className="fill-ink-faint text-[16px] md:text-[10px]"
        >
          increasing
        </text>

        <g transform={`rotate(-90 ${PAD.left - 30} ${midY})`}>
          <text
            x={PAD.left - 30}
            y={midY}
            textAnchor="middle"
            fontFamily="var(--font-jetbrains-mono)"
            className="fill-ink-soft text-[16px] md:text-[10px]"
          >
            harm trend ↑
          </text>
        </g>

        {/* Main dot — GSAP-driven landing with overshoot + ripple. */}
        {dot && (
          <g key={dotAnimated ? `${dot.x}-${dot.y}-${dot.color}` : "live-dot"}>
            <circle
              className="quad-dot-ripple"
              cx={dotX}
              cy={dotY}
              r={0}
              fill="none"
              stroke={dot.color}
              strokeWidth={1.5}
              opacity={0}
            />
            <circle
              className="quad-dot-circle"
              cx={dotX}
              cy={dotY}
              r={11}
              fill={dot.color}
              stroke="#fff"
              strokeWidth={1.5}
              style={{ transformBox: "fill-box" }}
            />
          </g>
        )}
      </svg>

      {/* Unclassifiable mass — the fifth outcome lives off the grid. */}
      <AnimatePresence>
        {weights && weights.unclassifiable > 0 ? (
          <motion.div
            key="unclassifiable"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur, delay: reduced ? 0 : 0.3 }}
            className={`mt-1 mb-1 md:mb-2 max-w-[500px] mx-auto px-2 ${pillClassName ?? ""}`}
          >
            <div className="border border-dashed border-ink-faint/60 px-3 py-1 md:py-2 flex items-baseline gap-3">
              <span className="font-display font-bold text-[15px] md:text-[18px] leading-none text-ink-soft">
                {formatWeight(weights.unclassifiable)}
              </span>
              <span className="font-display italic text-[12.5px] md:text-[14px] text-ink-faint">
                {unclassifiableCopy.label} — evidence too uncertain to place
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Verdict caption — desktop only: below md the step text beside the
          chart says the same thing, and dropping the caption lets the chart
          render full-size instead of shrinking to make room. */}
      <AnimatePresence>
        {showVerdict && verdictCopy ? (
          <motion.div
            key="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur, delay: reduced ? 0 : 0.2 }}
            className="max-md:hidden mt-2 max-w-[500px] mx-auto px-2"
          >
            <div className="font-display italic text-[14px] text-ink-faint mb-1">
              Classification
            </div>
            <p
              className="font-display italic text-[19px] leading-snug"
              style={{ color: getVerdictColor(activeQuadrant) }}
            >
              {verdictCopy.label}.
            </p>
            <p className="font-body text-[14px] text-ink-soft leading-snug mt-1">
              {verdictDetail ?? verdictCopy.summary}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function getVerdictColor(q: Quadrant | null) {
  if (q === "escalating") return "var(--escalating)";
  if (q === "mitigating") return "var(--mitigating-deep)";
  if (q === "concentrating") return "var(--concentrating)";
  if (q === "receding") return "var(--receding)";
  return "var(--ink)";
}

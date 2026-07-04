"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Quadrant, ClassificationWeights } from "@/lib/case-data";
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
  label: string;
  caseLabel: string;
};

const formatWeight = (w: number) => `${(w * 100).toFixed(1)}%`;

export function QuadrantChart({
  activeQuadrant,
  dot,
  weights,
  showVerdict,
  verdictDetail,
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
      if (reduced) {
        gsap.set(".quad-dot-circle", { scale: 1, opacity: 1 });
        gsap.set(".quad-dot-label", { opacity: 1 });
        gsap.set(".quad-dot-ripple", { opacity: 0 });
        return;
      }
      gsap.set(".quad-dot-circle", { transformOrigin: "center center", scale: 0, opacity: 1 });
      gsap.set(".quad-dot-label", { opacity: 0 });
      gsap.set(".quad-dot-ripple", { attr: { r: 0 }, opacity: 0.6 });

      const tl = gsap.timeline();
      tl.to(".quad-dot-circle", {
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.7)",
      })
        .to(
          ".quad-dot-ripple",
          {
            attr: { r: 36 },
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "<",
        )
        .to(".quad-dot-label", { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.25");
    },
    { scope: containerRef, dependencies: [dot?.x, dot?.y, dot?.color, reduced] },
  );

  return (
    <div ref={containerRef} className="w-full max-w-[560px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
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
            animate={{ opacity: activeQuadrant === q.key ? 0.12 : 0 }}
            transition={{ duration: tDur }}
          />
        ))}

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

        {/* Quadrant labels */}
        {QUADS.map((q) => {
          const cx = q.x + halfW / 2;
          const cy = q.y + 26;
          const copy = quadrantCopy[q.key];
          const isActive = activeQuadrant === q.key;
          return (
            <g key={q.key}>
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                fontFamily="var(--next-font-heading)"
                fontSize="17"
                fontStyle="italic"
                fill={isActive ? q.fill : "var(--ink-soft)"}
              >
                {copy.label}
              </text>
              <text
                x={cx}
                y={cy + 16}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="9"
                className="fill-ink-faint"
              >
                {copy.trends.h} · {copy.trends.e}
              </text>
              <text
                x={cx}
                y={q.y + halfH - 8}
                textAnchor="middle"
                fontFamily="var(--next-font-heading)"
                fontStyle="italic"
                fontSize="11"
                className="fill-ink-faint"
              >
                {copy.description}
              </text>
            </g>
          );
        })}

        {/* Probability-weight chips */}
        <AnimatePresence>
          {weights
            ? QUADS.filter((q) => (weights[q.key] ?? 0) > 0).map((q, i) => (
                <motion.text
                  key={`w-${q.key}`}
                  x={q.x + halfW / 2}
                  y={q.y + 26 + 40}
                  textAnchor="middle"
                  fontFamily="var(--next-font-heading)"
                  fontWeight="700"
                  fontSize="24"
                  fill={q.key === "mitigating" ? "var(--mitigating-deep)" : q.fill}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: tDur, delay: reduced ? 0 : i * 0.15 }}
                >
                  {formatWeight(weights[q.key])}
                </motion.text>
              ))
            : null}
        </AnimatePresence>

        {/* Axes */}
        <text
          x={midX}
          y={PAD.top + PLOT_H + 30}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="10"
          className="fill-ink-soft"
        >
          E trend →
        </text>
        <text
          x={PAD.left + 8}
          y={PAD.top + PLOT_H + 30}
          textAnchor="start"
          fontFamily="var(--next-font-heading)"
          fontStyle="italic"
          fontSize="10"
          className="fill-ink-faint"
        >
          decreasing
        </text>
        <text
          x={PAD.left + PLOT_W - 8}
          y={PAD.top + PLOT_H + 30}
          textAnchor="end"
          fontFamily="var(--next-font-heading)"
          fontStyle="italic"
          fontSize="10"
          className="fill-ink-faint"
        >
          increasing
        </text>

        <g transform={`rotate(-90 ${PAD.left - 30} ${midY})`}>
          <text
            x={PAD.left - 30}
            y={midY}
            textAnchor="middle"
            fontFamily="var(--font-jetbrains-mono)"
            fontSize="10"
            className="fill-ink-soft"
          >
            Ĥ trend ↑
          </text>
        </g>

        {/* Main dot — GSAP-driven landing with overshoot + ripple. */}
        {dot && (
          <g key={`${dot.x}-${dot.y}-${dot.color}`}>
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
            <text
              className="quad-dot-label"
              x={dotX + 16}
              y={dotY + 4}
              fontFamily="var(--font-jetbrains-mono)"
              fontSize="10"
              fill="var(--ink)"
              letterSpacing="0.06em"
              opacity={0}
            >
              {dot.caseLabel}
            </text>
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
            className="mt-1 mb-2 max-w-[500px] mx-auto px-2"
          >
            <div className="border border-dashed border-ink-faint/60 px-3 py-2 flex items-baseline gap-3">
              <span className="font-display font-bold text-[18px] leading-none text-ink-soft">
                {formatWeight(weights.unclassifiable)}
              </span>
              <span className="font-display italic text-[14px] text-ink-faint">
                {unclassifiableCopy.label} — evidence too uncertain to place
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Verdict caption */}
      <AnimatePresence>
        {showVerdict && verdictCopy ? (
          <motion.div
            key="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur, delay: reduced ? 0 : 0.2 }}
            className="mt-2 max-w-[500px] mx-auto px-2"
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

"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { quadrantCopy, type Quadrant } from "@/lib/case-data";

const FADE = { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] as const };

const W = 500;
const H = 420;
const PAD = { top: 28, right: 28, bottom: 56, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const midX = PAD.left + PLOT_W / 2;
const midY = PAD.top + PLOT_H / 2;

// Quadrant layout (Ĥ trend on x, E trend on y):
//                E ↑
//   Mitigating | Escalating
//   Ĥ ↓        | Ĥ ↑
//   ──────────────────────
//   Receding   | Concentrating
//                E ↓
const QUADS: {
  key: Quadrant;
  x: number;
  y: number;
  fill: string;
}[] = [
  { key: "mitigating", x: PAD.left, y: PAD.top, fill: "var(--mitigating)" },
  { key: "escalating", x: midX, y: PAD.top, fill: "var(--escalating)" },
  { key: "receding", x: PAD.left, y: midY, fill: "var(--receding)" },
  { key: "concentrating", x: midX, y: midY, fill: "var(--concentrating)" },
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

export function QuadrantChart({
  activeQuadrant,
  dot,
  ghostDot,
  showVerdict,
}: {
  activeQuadrant: Quadrant | null;
  dot: DotProps | null;
  ghostDot?: DotProps | null;
  showVerdict?: boolean;
}) {
  const reduced = useReducedMotion();
  const tDur = reduced ? 0 : FADE.duration;

  const verdictCopy = activeQuadrant ? quadrantCopy[activeQuadrant] : null;

  const dotX = dot ? PAD.left + dot.x * PLOT_W : 0;
  const dotY = dot ? PAD.top + dot.y * PLOT_H : 0;
  const ghostX = ghostDot ? PAD.left + ghostDot.x * PLOT_W : 0;
  const ghostY = ghostDot ? PAD.top + ghostDot.y * PLOT_H : 0;

  return (
    <div className="w-full max-w-[560px]">
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
          A two-by-two grid. The vertical axis is the exposure trend (E),
          decreasing at the bottom and increasing at the top. The horizontal
          axis is the harm-per-exposure trend (Ĥ), decreasing on the left and
          increasing on the right. The four quadrants are Mitigating
          (top-left), Escalating (top-right), Receding (bottom-left), and
          Concentrating (bottom-right).
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
                letterSpacing="0.14em"
                className="uppercase fill-ink-faint"
              >
                {copy.trends.h} · {copy.trends.e}
              </text>
              <text
                x={cx}
                y={q.y + halfH - 8}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="9"
                letterSpacing="0.12em"
                className="uppercase fill-ink-faint"
              >
                {copy.description}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <text
          x={midX}
          y={PAD.top + PLOT_H + 30}
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="10"
          letterSpacing="0.16em"
          className="uppercase fill-ink-soft"
        >
          Ĥ trend →
        </text>
        <text
          x={PAD.left + 8}
          y={PAD.top + PLOT_H + 30}
          textAnchor="start"
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="9"
          className="fill-ink-faint uppercase"
          letterSpacing="0.12em"
        >
          decreasing
        </text>
        <text
          x={PAD.left + PLOT_W - 8}
          y={PAD.top + PLOT_H + 30}
          textAnchor="end"
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="9"
          className="fill-ink-faint uppercase"
          letterSpacing="0.12em"
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
            letterSpacing="0.16em"
            className="uppercase fill-ink-soft"
          >
            E trend ↑
          </text>
        </g>

        {/* Ghost dot (lower z) */}
        <AnimatePresence>
          {ghostDot && (
            <motion.g
              key="ghost"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur }}
            >
              <circle
                cx={ghostX}
                cy={ghostY}
                r={9}
                fill="none"
                stroke={ghostDot.color}
                strokeWidth={1.4}
                strokeDasharray="2 3"
              />
              <text
                x={ghostX + 14}
                y={ghostY + 4}
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="9"
                fill={ghostDot.color}
                opacity={0.7}
                letterSpacing="0.06em"
              >
                {ghostDot.caseLabel}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Main dot */}
        <AnimatePresence>
          {dot && (
            <motion.g
              key="dot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur, delay: 0.1 }}
            >
              <circle
                cx={dotX}
                cy={dotY}
                r={11}
                fill={dot.color}
                stroke="#fff"
                strokeWidth={1.5}
              />
              <text
                x={dotX + 16}
                y={dotY + 4}
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="10"
                fill="var(--ink)"
                letterSpacing="0.06em"
              >
                {dot.caseLabel}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Verdict caption */}
      <AnimatePresence>
        {showVerdict && verdictCopy ? (
          <motion.div
            key="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur, delay: 0.2 }}
            className="mt-2 max-w-[500px] mx-auto px-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint mb-1">
              Classification
            </div>
            <p
              className="font-body italic text-[17px] leading-snug"
              style={{ color: getVerdictColor(activeQuadrant) }}
            >
              {verdictCopy.label}.
            </p>
            <p className="font-body text-[14px] text-ink-soft leading-snug mt-1">
              {verdictCopy.summary}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function getVerdictColor(q: Quadrant | null) {
  if (q === "escalating") return "var(--escalating)";
  if (q === "mitigating") return "var(--mitigating)";
  if (q === "concentrating") return "var(--concentrating)";
  if (q === "receding") return "var(--receding)";
  return "var(--ink)";
}

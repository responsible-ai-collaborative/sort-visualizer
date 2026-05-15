"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { resolveAct1 } from "@/lib/step-config";

// Synthetic monthly data series that mirrors the qualitative shape of the
// paper's Figure 1 (top): low and noisy 2020–2022, sharp inflection at the
// ChatGPT launch (Dec 2022), and continued climb through 2026. Exact values
// are illustrative; the paper itself notes that raw monthly counts conflate
// multiple effects and the framework's purpose is to separate them.
type Month = { idx: number; total: number; incidents: number; hazards: number };

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;
const MONTHS_PER_YEAR = 12;
const N = YEARS.length * MONTHS_PER_YEAR; // 84 months

function genMonths(): Month[] {
  // Deterministic pseudo-random so the chart is stable.
  let seed = 1;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };
  const out: Month[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1); // 0..1
    // Two-segment curve: flat-ish until ~Dec 2022 (i=35), then accelerating.
    const launch = 35;
    let base: number;
    if (i < launch) {
      base = 30 + 40 * (i / launch);
    } else {
      const post = (i - launch) / (N - 1 - launch);
      base = 70 + 450 * Math.pow(post, 1.05);
    }
    const noise = (rand() - 0.5) * 80 * (0.5 + t);
    const total = Math.max(15, Math.round(base + noise));
    // incidents track ~70% of total averaged; hazards ~25%
    out.push({
      idx: i,
      total,
      incidents: Math.round(total * 0.72),
      hazards: Math.round(total * 0.28),
    });
  }
  return out;
}

function rollingAvg(values: number[], window: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

const MONTHS = genMonths();
const INCIDENT_AVG = rollingAvg(
  MONTHS.map((m) => m.incidents),
  6,
);
const HAZARD_AVG = rollingAvg(
  MONTHS.map((m) => m.hazards),
  6,
);

// Layout
const W = 560;
const H = 360;
const PAD = { top: 28, right: 100, bottom: 56, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const MAX_Y = 640;

const x = (i: number) => PAD.left + (i / (N - 1)) * PLOT_W;
const y = (v: number) => PAD.top + PLOT_H - (v / MAX_Y) * PLOT_H;
const barW = PLOT_W / N - 1.2;

const incidentsPath = INCIDENT_AVG.map(
  (v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`,
).join(" ");
const hazardPath = HAZARD_AVG.map(
  (v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`,
).join(" ");

// Dec 2022 = month index 35 (Jan 2020 = 0, ..., Dec 2022 = 35)
const launchX = x(35);

// Callout band: mid-2025 attention spike
const calloutFrom = x(54);
const calloutTo = x(60);

const yearTicks = YEARS.map((yr, idx) => ({
  label: String(yr),
  x: x(idx * MONTHS_PER_YEAR),
}));

const yTicks = [0, 200, 400, 600];

const FADE = { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] as const };

export function IncidentsChart({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct1(activeStep);
  const reduced = useReducedMotion();
  const tDur = reduced ? 0 : FADE.duration;

  const titleText = state.pipeline
    ? "Monthly AI incident reports 2020–2026, with the framework pipeline that separates exposure from harm."
    : state.annotations
      ? "Monthly AI incident reports 2020–2026 with three competing interpretations of the rising trend."
      : "Monthly AI incident reports 2020–2026 — total counts climbing.";

  return (
    <div className="w-full max-w-[600px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="incidents-title incidents-desc"
      >
        <title id="incidents-title">{titleText}</title>
        <desc id="incidents-desc">
          A bar-and-line chart showing AI incident reports rising from ~30 per
          month in 2020 to ~600 per month by 2026, with a clear inflection at
          the ChatGPT launch in December 2022.
        </desc>

        {/* y-axis grid */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={PAD.left + PLOT_W}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--rule)"
              strokeWidth={0.6}
              strokeDasharray={v === 0 ? "" : "1 3"}
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 3.5}
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
          x={PAD.left - 38}
          y={PAD.top - 12}
          className="fill-ink-faint"
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="10"
          letterSpacing="0.08em"
        >
          COUNT / MO
        </text>

        {/* x-axis ticks */}
        {yearTicks.map((t) => (
          <g key={t.label}>
            <line
              x1={t.x}
              x2={t.x}
              y1={PAD.top + PLOT_H}
              y2={PAD.top + PLOT_H + 4}
              stroke="var(--rule)"
              strokeWidth={0.6}
            />
            <text
              x={t.x}
              y={PAD.top + PLOT_H + 18}
              textAnchor="middle"
              className="fill-ink-faint"
              fontFamily="var(--font-jetbrains-mono)"
              fontSize="10"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Callout band: a representative attention spike. */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: state.chart ? 0.5 : 0 }}
          transition={{ duration: tDur, delay: 0.2 }}
          x={calloutFrom}
          y={PAD.top}
          width={calloutTo - calloutFrom}
          height={PLOT_H}
          fill="var(--rule)"
        />

        {/* Monthly bars */}
        <AnimatePresence>
          {state.chart && (
            <motion.g
              key="bars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur }}
            >
              {MONTHS.map((m) => (
                <rect
                  key={m.idx}
                  x={x(m.idx) - barW / 2}
                  y={y(m.total)}
                  width={barW}
                  height={PAD.top + PLOT_H - y(m.total)}
                  fill="var(--rule)"
                  opacity={0.55}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Incidents 6-mo avg line */}
        <AnimatePresence>
          {state.chart && (
            <motion.path
              key="inc-line"
              d={incidentsPath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur, delay: 0.1 }}
            />
          )}
        </AnimatePresence>

        {/* Hazards 6-mo avg dashed line */}
        <AnimatePresence>
          {state.chart && (
            <motion.path
              key="haz-line"
              d={hazardPath}
              fill="none"
              stroke="var(--ink-soft)"
              strokeWidth={1.2}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur, delay: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* ChatGPT launch rule */}
        <AnimatePresence>
          {state.chart && (
            <motion.g
              key="launch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur, delay: 0.2 }}
            >
              <line
                x1={launchX}
                x2={launchX}
                y1={PAD.top}
                y2={PAD.top + PLOT_H}
                stroke="var(--ink-faint)"
                strokeWidth={0.8}
                strokeDasharray="2 2"
              />
              <text
                x={launchX + 4}
                y={PAD.top + 10}
                className="fill-ink-faint"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="9"
                letterSpacing="0.08em"
              >
                CHATGPT LAUNCH
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Inline legend at top-left */}
        <AnimatePresence>
          {state.chart && (
            <motion.g
              key="legend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: tDur }}
              transform={`translate(${PAD.left + 8}, ${PAD.top + 12})`}
            >
              <line x1={0} x2={18} y1={4} y2={4} stroke="var(--accent)" strokeWidth={1.6} />
              <text
                x={24}
                y={7}
                className="fill-ink-soft"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="10"
              >
                Incidents (6-mo avg)
              </text>
              <line
                x1={0}
                x2={18}
                y1={20}
                y2={20}
                stroke="var(--ink-soft)"
                strokeWidth={1.2}
                strokeDasharray="4 3"
              />
              <text
                x={24}
                y={23}
                className="fill-ink-soft"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="10"
              >
                Hazards (6-mo avg)
              </text>
              <rect x={0} y={32} width={18} height={6} fill="var(--rule)" opacity={0.6} />
              <text
                x={24}
                y={39}
                className="fill-ink-soft"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="10"
              >
                Total (monthly)
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Three competing interpretations (step 1.2) */}
        <AnimatePresence>
          {state.annotations && (
            <motion.g
              key="annos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur }}
              fontFamily="var(--next-font-body)"
              fontStyle="italic"
              fontSize="13"
              className="fill-note"
            >
              <text x={PAD.left + PLOT_W + 8} y={PAD.top + 30}>
                More deployment?
              </text>
              <text x={PAD.left + PLOT_W + 8} y={PAD.top + 110}>
                More reporting?
              </text>
              <text x={PAD.left + PLOT_W + 8} y={PAD.top + 190}>
                More harm per use?
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Pipeline caption (step 1.3) */}
      <AnimatePresence>
        {state.pipeline && (
          <motion.div
            key="pipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur }}
            className="mt-4"
          >
            <PipelineCaption />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PipelineCaption() {
  const items = [
    { label: "Deployed AI systems", sub: "Internal or external" },
    { label: "Recorded incidents", sub: "AIID · OECD AIM" },
    { label: "Monitoring questions", sub: "SORT framework" },
    { label: "Harm · Exposure", sub: "Estimation procedure" },
    { label: "Classification", sub: "2 × 2 trajectory" },
  ];
  return (
    <div className="flex items-stretch justify-between gap-2 mt-2 text-[10px] font-mono uppercase tracking-[0.12em]">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-2 flex-1">
          <div className="border border-rule bg-[rgba(255,255,255,0.5)] px-2 py-2 flex-1">
            <div className="text-ink-soft leading-tight">{item.label}</div>
            <div className="text-ink-faint normal-case font-body italic text-[10px] mt-0.5 tracking-normal">
              {item.sub}
            </div>
          </div>
          {i < items.length - 1 ? (
            <span className="text-ink-faint" aria-hidden>
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

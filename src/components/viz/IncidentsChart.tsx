"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { resolveAct1 } from "@/lib/step-config";
import incidentCountsRaw from "@/lib/incident-counts.json";
import { FrameworkFlow } from "@/components/viz/FrameworkFlow";

gsap.registerPlugin(useGSAP);

// Real monthly AI incident counts derived from the AI Incident Database
// snapshot (see incidents.csv at the repo root, parsed at build time).
// Trimmed to 2020-01 through 2025-12 (72 months) — 2026 data is partial.
type IncidentRow = { ym: string; count: number };
const MONTHS: IncidentRow[] = (incidentCountsRaw as IncidentRow[]).filter(
  (m) => m.ym < "2026-01",
);
const N = MONTHS.length; // 72

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;
const MONTHS_PER_YEAR = 12;

function rollingAvg(values: number[], window: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

const COUNTS = MONTHS.map((m) => m.count);
const INCIDENT_AVG = rollingAvg(COUNTS, 6);
// Approximate "hazards" trend at ~30% of the incidents series as a visual
// secondary line. The paper uses a separate database for hazards; this is a
// stylized stand-in until/unless we wire the OECD AIM hazards CSV too.
const HAZARD_AVG = rollingAvg(
  COUNTS.map((c) => c * 0.3),
  6,
);

const W = 560;
const H = 360;
const PAD = { top: 28, right: 100, bottom: 56, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
// Real data peak is 46/mo (April 2025). Round up to leave headroom.
const MAX_Y = Math.ceil(Math.max(...COUNTS) / 10) * 10 + 10;

const x = (i: number) => PAD.left + (i / (N - 1)) * PLOT_W;
const y = (v: number) => PAD.top + PLOT_H - (v / MAX_Y) * PLOT_H;
const barW = PLOT_W / N - 1.2;

const incidentsPath = INCIDENT_AVG.map(
  (v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`,
).join(" ");
const hazardPath = HAZARD_AVG.map(
  (v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`,
).join(" ");

const launchX = x(35); // Dec 2022

const yearTicks = YEARS.map((yr, idx) => ({
  label: String(yr),
  x: x(idx * MONTHS_PER_YEAR),
}));

// Build sensible y-axis ticks from MAX_Y (e.g. 60 → [0, 20, 40, 60]).
const Y_TICK_STEP = Math.ceil(MAX_Y / 3 / 5) * 5;
const yTicks = [0, Y_TICK_STEP, Y_TICK_STEP * 2, Y_TICK_STEP * 3].filter(
  (v) => v <= MAX_Y,
);

export function IncidentsChart({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct1(activeStep);
  const containerRef = useRef<HTMLDivElement>(null);
  const incidentsLineRef = useRef<SVGPathElement>(null);
  const hazardLineRef = useRef<SVGPathElement>(null);

  // Step 1.1 — chart appears: bars stagger up, lines draw on.
  useGSAP(
    () => {
      if (!state.chart) return;

      // Bar stagger: scaleY from bottom. We use SVG transforms via attr since
      // CSS transforms on inner SVG nodes are inconsistent across browsers.
      gsap.fromTo(
        ".inc-bar",
        { scaleY: 0, transformOrigin: "center bottom" },
        {
          scaleY: 1,
          duration: 0.55,
          stagger: { each: 0.008, from: "start" },
          ease: "power2.out",
        },
      );

      // Draw-on lines via stroke-dashoffset. We measure the path length at
      // animate time so it's correct regardless of viewport.
      const inc = incidentsLineRef.current;
      const haz = hazardLineRef.current;
      if (inc) {
        const len = inc.getTotalLength();
        gsap.fromTo(
          inc,
          { strokeDasharray: len, strokeDashoffset: len, opacity: 1 },
          {
            strokeDashoffset: 0,
            duration: 2.4,
            ease: "power2.out",
            delay: 0.5,
          },
        );
      }
      if (haz) {
        const len = haz.getTotalLength();
        gsap.fromTo(
          haz,
          { strokeDasharray: len, strokeDashoffset: len, opacity: 1 },
          {
            strokeDashoffset: 0,
            duration: 2.0,
            ease: "power2.out",
            delay: 0.9,
          },
        );
      }

      gsap.fromTo(
        ".inc-launch",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.4 },
      );

      gsap.fromTo(
        ".inc-legend",
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.45, delay: 0.2 },
      );
    },
    { scope: containerRef, dependencies: [state.chart] },
  );

  // Step 1.2 — annotations: each label slides in from the right with stagger.
  useGSAP(
    () => {
      if (!state.annotations) return;
      gsap.fromTo(
        ".inc-anno",
        { opacity: 0, x: 12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: "power3.out",
        },
      );
    },
    { scope: containerRef, dependencies: [state.annotations] },
  );

  // Step 1.3 pipeline entrance and dock morph are handled by SortPipeline (Framer Motion).

  const titleText = state.pipeline
    ? "Monthly AI incident reports 2020–2025, with the framework pipeline that separates exposure from harm."
    : state.annotations
      ? "Monthly AI incident reports 2020–2025 with three competing interpretations of the rising trend."
      : "Monthly AI incident reports 2020–2025 — total counts climbing.";

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] min-h-[420px]"
    >
      <div
        className={
          "transition-opacity duration-500 ease-out " +
          (state.pipeline ? "opacity-0 pointer-events-none" : "opacity-100")
        }
      >
        {state.chart && (
        <div className="inc-legend mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] text-ink-soft pl-[3.5rem]">
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
              className="inline-block h-2 w-4 align-middle"
              style={{ background: "var(--rule)", opacity: 0.7 }}
            />
            <span>Total (monthly)</span>
          </span>
        </div>
      )}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="incidents-title incidents-desc"
      >
        <title id="incidents-title">{titleText}</title>
        <desc id="incidents-desc">
          A bar-and-line chart showing real monthly AI incident counts from
          2020 to 2025, climbing from a handful per month early on to peaks
          above forty per month in 2025, with a clear inflection around the
          ChatGPT launch in December 2022.
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

        {/* Monthly bars — each is its own rect so GSAP can stagger them. */}
        {state.chart &&
          MONTHS.map((m, i) => (
            <rect
              key={m.ym}
              className="inc-bar"
              x={x(i) - barW / 2}
              y={y(m.count)}
              width={barW}
              height={PAD.top + PLOT_H - y(m.count)}
              fill="var(--rule)"
              opacity={0.55}
            />
          ))}

        {/* Incidents 6-mo avg line */}
        {state.chart && (
          <path
            ref={incidentsLineRef}
            d={incidentsPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.6}
            opacity={0}
          />
        )}

        {/* Hazards 6-mo avg dashed line */}
        {state.chart && (
          <path
            ref={hazardLineRef}
            d={hazardPath}
            fill="none"
            stroke="var(--ink-soft)"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            opacity={0}
          />
        )}

        {/* ChatGPT launch rule */}
        {state.chart && (
          <g className="inc-launch" opacity={0}>
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
          </g>
        )}

        {/* Three competing interpretations (step 1.2) */}
        {state.annotations && (
          <g
            fontFamily="var(--next-font-body)"
            fontStyle="italic"
            fontSize="13"
            className="fill-note"
          >
            <text className="inc-anno" x={PAD.left + PLOT_W + 8} y={PAD.top + 30} opacity={0}>
              More deployment?
            </text>
            <text className="inc-anno" x={PAD.left + PLOT_W + 8} y={PAD.top + 110} opacity={0}>
              More reporting?
            </text>
            <text className="inc-anno" x={PAD.left + PLOT_W + 8} y={PAD.top + 190} opacity={0}>
              More harm per use?
            </text>
          </g>
        )}
      </svg>
      </div>

      <div
        className={
          "absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out " +
          (state.pipeline ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      >
        <FrameworkFlow visible={state.pipeline} />
      </div>
    </div>
  );
}


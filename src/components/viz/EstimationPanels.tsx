"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { resolveAct3 } from "@/lib/step-config";
import { chatbotCase } from "@/lib/case-data";
import { TierBadge } from "@/components/TierBadge";

const FADE = { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] as const };

export function EstimationPanels({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct3(activeStep);
  const reduced = useReducedMotion();
  const tDur = reduced ? 0 : FADE.duration;

  const harmDimmed = state.focus === "exposure";

  return (
    <div className="w-full max-w-[640px] grid grid-cols-2 gap-4 text-[13px]">
      {/* HARM PANEL */}
      <motion.section
        animate={{ opacity: harmDimmed ? 0.4 : 1 }}
        transition={{ duration: tDur }}
        aria-label="Harm estimation panel"
        className="flex flex-col gap-3 p-3 border border-rule bg-[rgba(255,255,255,0.45)]"
      >
        <PanelHeading title="Harm" letter="H" />

        <AnimatePresence>
          {state.harm.aiid && (
            <SourceCard
              key="aiid"
              tag="AIID"
              name="AI Incident Database"
              tDur={tDur}
            >
              <CountSpark
                values={chatbotCase.harm.sources[0].values!}
                color="var(--ink-soft)"
              />
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                Tier 2 · proxy construction · lower bound
              </div>
            </SourceCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.harm.oecd && (
            <SourceCard
              key="oecd"
              tag="OECD AIM"
              name="AI Incidents Monitor"
              tDur={tDur}
            >
              <CountSpark
                values={chatbotCase.harm.sources[1].values!}
                color="var(--ink-soft)"
              />
              <div className="font-mono text-[9px] text-ink-faint">
                Harm count 9–17 (2024) → ~100k range (2025)
              </div>
            </SourceCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.harm.openai && (
            <SourceCard
              key="openai"
              tag="OpenAI"
              name="Weekly user report"
              tDur={tDur}
            >
              <CeilingIndicator
                display={chatbotCase.harm.sources[2].ceiling!.display}
                note={chatbotCase.harm.sources[2].ceiling!.note}
              />
            </SourceCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.harm.conclusion && (
            <motion.div
              key="harm-conclusion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur }}
              className="mt-auto pt-3 border-t border-rule flex flex-col gap-2"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                Trend → <span className="text-accent">Increasing · Ĥ ↑</span>
              </div>
              <div>
                <TierBadge tier={2} label="Low" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* EXPOSURE PANEL */}
      <motion.section
        animate={{ opacity: state.focus === "harm" ? 0.4 : 1 }}
        transition={{ duration: tDur }}
        aria-label="Exposure estimation panel"
        className="flex flex-col gap-3 p-3 border border-rule bg-[rgba(255,255,255,0.45)]"
      >
        <PanelHeading title="Exposure" letter="E" />

        <AnimatePresence>
          {state.exposure.intro && !state.exposure.pew && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur }}
              className="font-body italic text-ink-soft text-[14px] leading-snug py-6"
            >
              No direct survey data on emotional-support use exists. Exposure
              must be approximated from partial proxies.
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.exposure.pew && (
            <SourceCard key="pew" tag="Pew" name="Sidoti & McClain, 2025" tDur={tDur}>
              <PewMiniViz />
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                Category-adjacent proxy
              </div>
            </SourceCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.exposure.marketShare && (
            <SourceCard
              key="market"
              tag="FATJOE"
              name="LLM market share"
              tDur={tDur}
            >
              <MarketShareMiniViz />
            </SourceCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.exposure.conclusion && (
            <motion.div
              key="exp-conclusion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tDur }}
              className="mt-auto pt-3 border-t border-rule flex flex-col gap-2"
            >
              <div className="grid grid-cols-2 gap-2">
                {chatbotCase.exposure.estimates.map((e) => (
                  <div key={e.year} className="font-mono text-[10px] text-ink-soft">
                    <div className="text-ink-faint uppercase tracking-[0.14em] text-[9px]">
                      {e.year}
                    </div>
                    <div className="text-[13px] text-accent font-body italic">
                      {e.display}
                    </div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                Trend → <span className="text-accent">Increasing · E ↑</span>
              </div>
              <div>
                <TierBadge tier={2} label="Medium" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}

function PanelHeading({ title, letter }: { title: string; letter: string }) {
  return (
    <header className="flex items-center justify-between border-b border-rule pb-2">
      <h3
        className="font-display text-[22px] leading-none text-ink"
      >
        {title}
      </h3>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        Variable {letter}
      </div>
    </header>
  );
}

function SourceCard({
  tag,
  name,
  tDur,
  children,
}: {
  tag: string;
  name: string;
  tDur: number;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: tDur }}
      className="flex flex-col gap-1.5 border-l-2 border-rule pl-2.5 pb-1"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          {tag}
        </span>
        <span className="font-body italic text-[11px] text-ink-faint">{name}</span>
      </div>
      {children}
    </motion.article>
  );
}

function CountSpark({
  values,
  color,
}: {
  values: { year: string; value: number }[];
  color: string;
}) {
  const max = Math.max(...values.map((v) => v.value));
  const W = 220;
  const H = 36;
  return (
    <div className="flex items-end gap-3">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="flex-1">
        {values.map((v, i) => {
          const barW = 24;
          const gap = 12;
          const x = i * (barW + gap) + 2;
          const h = (v.value / max) * (H - 14);
          return (
            <g key={v.year}>
              <rect x={x} y={H - h - 12} width={barW} height={h} fill={color} />
              <text
                x={x + barW / 2}
                y={H - 2}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="9"
                className="fill-ink-faint"
              >
                {v.year}
              </text>
              <text
                x={x + barW / 2}
                y={H - h - 14}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="10"
                className="fill-ink"
              >
                {v.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CeilingIndicator({ display, note }: { display: string; note: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-9 border-b border-rule">
        <div
          className="absolute left-0 right-0 top-2 border-t-2 border-dashed"
          style={{ borderColor: "var(--accent)" }}
          aria-hidden
        />
        <div className="absolute right-1 top-3 font-mono text-[10px] text-accent">{display}</div>
        <div className="absolute left-1 bottom-0 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
          Upper bound
        </div>
      </div>
      <div className="font-body italic text-[11px] text-ink-faint leading-snug">{note}</div>
    </div>
  );
}

function PewMiniViz() {
  // Three age buckets, two stripes each (entertainment / learn-new-things)
  const buckets = [
    { age: "18–29", a: 18, b: 35 },
    { age: "30–49", a: 12, b: 26 },
    { age: "50–64", a: 6, b: 14 },
  ];
  const W = 260;
  const H = 52;
  const max = 40;
  const groupW = W / buckets.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {buckets.map((b, i) => {
        const x0 = i * groupW + 6;
        const barW = 12;
        const aH = (b.a / max) * (H - 16);
        const bH = (b.b / max) * (H - 16);
        return (
          <g key={b.age}>
            <rect x={x0} y={H - 12 - aH} width={barW} height={aH} fill="var(--accent-soft)" />
            <rect
              x={x0 + barW + 4}
              y={H - 12 - bH}
              width={barW}
              height={bH}
              fill="var(--accent)"
            />
            <text
              x={x0 + barW + 2}
              y={H - 2}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono)"
              fontSize="9"
              className="fill-ink-faint"
            >
              {b.age}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${W - 130}, 4)`}>
        <rect x={0} y={0} width={8} height={8} fill="var(--accent-soft)" />
        <text
          x={12}
          y={7}
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="9"
          className="fill-ink-faint"
        >
          For entertainment
        </text>
        <rect x={0} y={12} width={8} height={8} fill="var(--accent)" />
        <text
          x={12}
          y={19}
          fontFamily="var(--font-jetbrains-mono)"
          fontSize="9"
          className="fill-ink-faint"
        >
          To learn new things
        </text>
      </g>
    </svg>
  );
}

function MarketShareMiniViz() {
  // Stacked bar showing 70% / 80% / 90% scenarios
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[36px_1fr_44px] items-center gap-2 font-mono text-[9px] text-ink-faint">
        <span>LOWER</span>
        <Bar pct={70} color="var(--rule)" />
        <span>70%</span>
      </div>
      <div className="grid grid-cols-[36px_1fr_44px] items-center gap-2 font-mono text-[9px] text-ink-soft">
        <span>POINT</span>
        <Bar pct={80} color="var(--accent)" />
        <span>80%</span>
      </div>
      <div className="grid grid-cols-[36px_1fr_44px] items-center gap-2 font-mono text-[9px] text-ink-faint">
        <span>UPPER</span>
        <Bar pct={90} color="var(--rule)" />
        <span>90%</span>
      </div>
      <div className="font-body italic text-[11px] text-ink-faint leading-snug">
        Applied as scalar to extend ChatGPT shares to all conversational AI use.
      </div>
    </div>
  );
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 bg-rule/50 relative">
      <div className="absolute left-0 top-0 h-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

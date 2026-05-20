"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { resolveAct3, type Act3State } from "@/lib/step-config";
import { chatbotCase } from "@/lib/case-data";
import { TierBadge } from "@/components/TierBadge";

gsap.registerPlugin(useGSAP);

// One variable at a time. Steps 3.1–3.3 build the HARM panel, then focus
// switches at 3.4 and steps 3.4–3.6 build the EXPOSURE panel. Each source
// gets a full-width card with big legible numbers and clear visual roles
// (count sparkpair vs ceiling line vs assumption boxes). GSAP drives the
// card reveals, number count-ups, and bar growth.

export function EstimationPanels({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct3(activeStep);
  return (
    <div className="w-full max-w-[640px]">
      {state.focus === "harm" ? (
        <HarmPanel state={state} />
      ) : (
        <ExposurePanel state={state} />
      )}
    </div>
  );
}

// ── Layout primitives ─────────────────────────────────────────────────────

function PanelHeader({
  letter,
  title,
  role,
  carryover,
}: {
  letter: string;
  title: string;
  role: string;
  carryover?: ReactNode;
}) {
  return (
    <header className="mb-5 pb-4 border-b border-rule flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 flex items-center justify-center font-display font-bold text-[26px] text-white"
          style={{ background: "var(--accent)" }}
          aria-hidden
        >
          {letter}
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            {role}
          </div>
          <h3 className="font-display text-[22px] leading-tight text-ink font-semibold">
            {title}
          </h3>
        </div>
      </div>
      {carryover ? (
        <div className="text-right font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-faint max-w-[170px] leading-snug">
          {carryover}
        </div>
      ) : null}
    </header>
  );
}

function SourceCard({
  tag,
  role,
  className,
  children,
}: {
  tag: string;
  role: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`${className ?? ""} source-card border border-rule p-4`}
      style={{ background: "rgba(255, 255, 255, 0.7)" }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent font-semibold">
          {tag}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
          {role}
        </span>
      </div>
      {children}
    </article>
  );
}

function ConclusionBar({
  className,
  trend,
  trendDirection,
  tier,
  label,
}: {
  className?: string;
  trend: string;
  trendDirection: string;
  tier: 1 | 2 | 3;
  label: "High" | "Medium" | "Low";
}) {
  return (
    <div
      className={`${className ?? ""} conclusion-bar opacity-0 mt-5 pt-4 border-t border-rule flex items-center justify-between gap-4`}
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint mb-1">
          Trend
        </div>
        <div className="font-display text-[20px] leading-none font-semibold text-accent">
          {trend} <span className="text-ink-faint font-normal">· {trendDirection}</span>
        </div>
      </div>
      <TierBadge tier={tier} label={label} />
    </div>
  );
}

// ── HARM PANEL ────────────────────────────────────────────────────────────

function HarmPanel({ state }: { state: Act3State }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (state.harm.aiid) animateCardIn(".harm-aiid");
      if (state.harm.oecd) animateCardIn(".harm-oecd");
      if (state.harm.openai) animateCardIn(".harm-openai");
      if (state.harm.conclusion) animateConclusionIn(".harm-conclusion");
    },
    {
      scope: ref,
      dependencies: [
        state.harm.aiid,
        state.harm.oecd,
        state.harm.openai,
        state.harm.conclusion,
      ],
    },
  );

  const aiid = chatbotCase.harm.sources[0];
  const oecd = chatbotCase.harm.sources[1];
  const openai = chatbotCase.harm.sources[2];

  return (
    <div ref={ref}>
      <PanelHeader letter="H" role="Variable H" title="Estimating harm" />

      <div className="space-y-3">
        {state.harm.aiid && (
          <SourceCard
            tag="AIID"
            role="Lower bound · Tier 2"
            className="harm-aiid opacity-0"
          >
            <div className="flex items-center gap-5">
              <BarPair
                v1={aiid.values![0].value}
                v2={aiid.values![1].value}
                max={60}
                rootClass="harm-aiid"
              />
              <p className="font-body italic text-[13px] leading-snug text-ink-soft flex-1">
                LLM-assisted scan of the{" "}
                <span className="text-ink">AI Incident Database</span> finds 2
                full matches in 2024. Two matches falls below the threshold for
                a reliable trend signal.
              </p>
            </div>
          </SourceCard>
        )}

        {state.harm.oecd && (
          <SourceCard
            tag="OECD AIM"
            role="Lower bound · Tier 2"
            className="harm-oecd opacity-0"
          >
            <div className="flex items-center gap-5">
              <BarPair
                v1={oecd.values![0].value}
                v2={oecd.values![1].value}
                max={60}
                rootClass="harm-oecd"
              />
              <p className="font-body italic text-[13px] leading-snug text-ink-soft flex-1">
                Different sourcing pipeline. Harm count{" "}
                <span className="text-ink">9–17 (2024) → ~100k range (2025)</span>{" "}
                — an explosive increase in implied severity.
              </p>
            </div>
          </SourceCard>
        )}

        {state.harm.openai && (
          <SourceCard
            tag="OpenAI"
            role="Upper bound · proxy"
            className="harm-openai opacity-0"
          >
            <div className="flex items-center gap-5">
              <CeilingViz display={openai.ceiling!.display} rootClass="harm-openai" />
              <p className="font-body italic text-[13px] leading-snug text-ink-soft flex-1">
                <span className="text-ink">≈ 0.15% of weekly active users</span>{" "}
                in conversations indicating potential suicidal planning — a
                ceiling derived from a proxy proportion, not a match count.
              </p>
            </div>
          </SourceCard>
        )}
      </div>

      {state.harm.conclusion && (
        <ConclusionBar
          className="harm-conclusion"
          trend="Increasing"
          trendDirection="Ĥ ↑"
          tier={2}
          label="Low"
        />
      )}
    </div>
  );
}

// ── EXPOSURE PANEL ────────────────────────────────────────────────────────

function ExposurePanel({ state }: { state: Act3State }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (state.exposure.intro) {
        gsap.fromTo(
          ".exposure-intro",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        );
      }
      if (state.exposure.pew) animateCardIn(".exposure-pew");
      if (state.exposure.marketShare) animateCardIn(".exposure-market", 0.15);
      if (state.exposure.conclusion) {
        animateCardIn(".exposure-estimates");
        animateConclusionIn(".exposure-conclusion");
      }
    },
    {
      scope: ref,
      dependencies: [
        state.exposure.intro,
        state.exposure.pew,
        state.exposure.marketShare,
        state.exposure.conclusion,
      ],
    },
  );

  return (
    <div ref={ref}>
      <PanelHeader
        letter="E"
        role="Variable E"
        title="Estimating exposure"
        carryover={
          <>
            H ✓ · Increasing
            <br />
            Tier 2 · Low
          </>
        }
      />

      <div className="space-y-3">
        {state.exposure.intro && !state.exposure.pew && (
          <p className="exposure-intro opacity-0 font-body italic text-[15px] leading-snug text-ink-soft py-6 text-center">
            No direct survey data on emotional-support use exists. Exposure
            must be approximated from partial proxies.
          </p>
        )}

        {state.exposure.pew && (
          <SourceCard
            tag="Pew Research"
            role="Category-adjacent proxy"
            className="exposure-pew opacity-0"
          >
            <div className="flex items-center gap-5">
              <PewViz />
              <p className="font-body italic text-[13px] leading-snug text-ink-soft flex-1">
                ChatGPT use by age group: <span className="text-ink">&ldquo;for
                entertainment&rdquo;</span> (lower bound) and{" "}
                <span className="text-ink">&ldquo;to learn new things&rdquo;</span>{" "}
                (upper bound). Mid-point becomes the central estimate.
              </p>
            </div>
          </SourceCard>
        )}

        {state.exposure.marketShare && (
          <SourceCard
            tag="FATJOE"
            role="× market-share scalar"
            className="exposure-market opacity-0"
          >
            <MarketShareViz />
          </SourceCard>
        )}

        {state.exposure.conclusion && (
          <SourceCard
            tag="Final estimate"
            role="2024 → 2025"
            className="exposure-estimates opacity-0"
          >
            <div className="flex items-end justify-around gap-4">
              {chatbotCase.exposure.estimates.map((e) => (
                <div key={e.year} className="text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint mb-1">
                    {e.year}
                  </div>
                  <div
                    className="font-display font-bold text-[42px] leading-none text-accent"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {e.display.split(" ")[0]}
                  </div>
                  <div className="font-mono text-[10px] text-ink-faint mt-1">
                    {e.display.replace(/^[^(]+/, "").trim()}
                  </div>
                </div>
              ))}
            </div>
          </SourceCard>
        )}
      </div>

      {state.exposure.conclusion && (
        <ConclusionBar
          className="exposure-conclusion"
          trend="Increasing ~40%"
          trendDirection="E ↑"
          tier={2}
          label="Medium"
        />
      )}
    </div>
  );
}

// ── Visualizations ────────────────────────────────────────────────────────

function BarPair({
  v1,
  v2,
  max,
  rootClass,
}: {
  v1: number;
  v2: number;
  max: number;
  rootClass: string;
}) {
  const W = 200;
  const H = 130;
  const barW = 50;
  const x1 = 30;
  const x2 = 110;
  const padBottom = 24;
  const padTop = 28;
  const h1 = (v1 / max) * (H - padTop - padBottom);
  const h2 = (v2 / max) * (H - padTop - padBottom);

  const bar1Ref = useRef<SVGRectElement>(null);
  const bar2Ref = useRef<SVGRectElement>(null);
  const num1Ref = useRef<SVGTextElement>(null);
  const num2Ref = useRef<SVGTextElement>(null);

  useGSAP(
    () => {
      // Bars grow with overshoot
      gsap.set([bar1Ref.current, bar2Ref.current], {
        scaleY: 0,
        transformOrigin: "center bottom",
        transformBox: "fill-box",
      });
      gsap.to(bar1Ref.current, {
        scaleY: 1,
        duration: 0.7,
        ease: "back.out(1.2)",
        delay: 0.2,
      });
      gsap.to(bar2Ref.current, {
        scaleY: 1,
        duration: 0.7,
        ease: "back.out(1.2)",
        delay: 0.35,
      });
      // Numbers count up
      countUpEl(num1Ref.current, v1, 0.8, 0.4);
      countUpEl(num2Ref.current, v2, 0.8, 0.55);
    },
    { scope: `.${rootClass}`, dependencies: [v1, v2] },
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-[200px] flex-shrink-0">
      {/* baseline */}
      <line
        x1={10}
        x2={W - 10}
        y1={H - padBottom + 1}
        y2={H - padBottom + 1}
        stroke="var(--rule)"
        strokeWidth={1}
      />
      {/* 2024 bar */}
      <rect
        ref={bar1Ref}
        x={x1}
        y={H - padBottom - h1}
        width={barW}
        height={Math.max(h1, 2)}
        fill="var(--accent)"
        opacity={0.7}
      />
      <text
        ref={num1Ref}
        x={x1 + barW / 2}
        y={H - padBottom - h1 - 8}
        textAnchor="middle"
        fontFamily="var(--next-font-heading)"
        fontWeight="700"
        fontSize="22"
        fill="var(--ink)"
      >
        0
      </text>
      <text
        x={x1 + barW / 2}
        y={H - 6}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono)"
        fontSize="10"
        fill="var(--ink-faint)"
        letterSpacing="0.06em"
      >
        2024
      </text>
      {/* 2025 bar */}
      <rect
        ref={bar2Ref}
        x={x2}
        y={H - padBottom - h2}
        width={barW}
        height={Math.max(h2, 2)}
        fill="var(--accent)"
      />
      <text
        ref={num2Ref}
        x={x2 + barW / 2}
        y={H - padBottom - h2 - 8}
        textAnchor="middle"
        fontFamily="var(--next-font-heading)"
        fontWeight="700"
        fontSize="22"
        fill="var(--ink)"
      >
        0
      </text>
      <text
        x={x2 + barW / 2}
        y={H - 6}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono)"
        fontSize="10"
        fill="var(--ink-faint)"
        letterSpacing="0.06em"
      >
        2025
      </text>
    </svg>
  );
}

function CeilingViz({ display, rootClass }: { display: string; rootClass: string }) {
  const lineRef = useRef<SVGLineElement>(null);

  useGSAP(
    () => {
      const line = lineRef.current;
      if (!line) return;
      const len = line.getTotalLength?.() ?? 200;
      gsap.set(line, { strokeDasharray: `${len}`, strokeDashoffset: len, opacity: 1 });
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.fromTo(
        ".ceiling-label",
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.6 },
      );
    },
    { scope: `.${rootClass}`, dependencies: [display] },
  );

  return (
    <svg viewBox="0 0 200 130" className="w-[200px] flex-shrink-0">
      {/* baseline */}
      <line
        x1={10}
        x2={190}
        y1={108}
        y2={108}
        stroke="var(--rule)"
        strokeWidth={1}
      />
      {/* faint upward arrow ghost */}
      <text
        x={100}
        y={70}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono)"
        fontSize="9"
        fill="var(--ink-faint)"
        letterSpacing="0.12em"
        className="uppercase ceiling-label"
        opacity={0}
      >
        ceiling
      </text>
      {/* dashed ceiling line */}
      <line
        ref={lineRef}
        x1={10}
        x2={190}
        y1={50}
        y2={50}
        stroke="var(--accent)"
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <text
        x={100}
        y={42}
        textAnchor="middle"
        fontFamily="var(--next-font-heading)"
        fontWeight="700"
        fontSize="20"
        fill="var(--accent)"
        className="ceiling-label"
        opacity={0}
      >
        {display}
      </text>
    </svg>
  );
}

function PewViz() {
  const buckets = [
    { age: "18–29", entertainment: 18, learn: 35 },
    { age: "30–49", entertainment: 12, learn: 26 },
    { age: "50–64", entertainment: 6, learn: 14 },
  ];
  const W = 200;
  const H = 130;
  const max = 40;
  const groupW = (W - 20) / buckets.length;
  const baseY = H - 24;
  const maxH = baseY - 18;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-[200px] flex-shrink-0">
      <line x1={10} x2={W - 10} y1={baseY + 1} y2={baseY + 1} stroke="var(--rule)" strokeWidth={1} />
      {buckets.map((b, i) => {
        const x0 = 10 + i * groupW + 8;
        const barW = 14;
        const eH = (b.entertainment / max) * maxH;
        const lH = (b.learn / max) * maxH;
        return (
          <g key={b.age}>
            <rect
              className="pew-bar"
              x={x0}
              y={baseY - eH}
              width={barW}
              height={Math.max(eH, 1)}
              fill="var(--accent-soft)"
              style={{ transformOrigin: "center bottom", transformBox: "fill-box" }}
            />
            <rect
              className="pew-bar"
              x={x0 + barW + 4}
              y={baseY - lH}
              width={barW}
              height={Math.max(lH, 1)}
              fill="var(--accent)"
              style={{ transformOrigin: "center bottom", transformBox: "fill-box" }}
            />
            <text
              x={x0 + barW + 2}
              y={baseY + 14}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono)"
              fontSize="9"
              fill="var(--ink-faint)"
            >
              {b.age}
            </text>
          </g>
        );
      })}
      {/* legend */}
      <g transform={`translate(8, 8)`}>
        <rect width={8} height={8} fill="var(--accent-soft)" />
        <text x={12} y={7} fontFamily="var(--font-jetbrains-mono)" fontSize="8" fill="var(--ink-faint)">
          entertainment
        </text>
        <rect y={12} width={8} height={8} fill="var(--accent)" />
        <text x={12} y={19} fontFamily="var(--font-jetbrains-mono)" fontSize="8" fill="var(--ink-faint)">
          learn new things
        </text>
      </g>
    </svg>
  );
}

function MarketShareViz() {
  const rows = [
    { tag: "Lower bound", pct: 70, accent: false },
    { tag: "Point estimate", pct: 80, accent: true },
    { tag: "Upper bound", pct: 90, accent: false },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div
          key={r.tag}
          className="grid grid-cols-[110px_1fr_50px] items-center gap-3 font-mono text-[10px]"
        >
          <span className={`uppercase tracking-[0.12em] ${r.accent ? "text-accent" : "text-ink-faint"}`}>
            {r.tag}
          </span>
          <div className="ms-track h-2 bg-rule/50 relative overflow-hidden">
            <div
              className="ms-fill absolute left-0 top-0 h-full"
              style={{
                width: `${r.pct}%`,
                background: r.accent ? "var(--accent)" : "var(--accent-soft)",
              }}
            />
          </div>
          <span className={`text-right ${r.accent ? "text-accent font-semibold" : "text-ink-faint"}`}>
            {r.pct}%
          </span>
        </div>
      ))}
      <p className="font-body italic text-[12px] leading-snug text-ink-faint pt-1">
        Applied as a scalar to extend ChatGPT shares to all conversational-AI
        use.
      </p>
    </div>
  );
}

// ── GSAP helpers ──────────────────────────────────────────────────────────

function animateCardIn(selector: string, delay = 0) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay },
  );
}

function animateConclusionIn(selector: string) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.25 },
  );
}

function countUpEl(
  el: SVGTextElement | null,
  to: number,
  duration: number,
  delay: number,
) {
  if (!el) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: to,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = String(Math.round(obj.val));
    },
  });
}

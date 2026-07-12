"use client";

// Standalone practitioner tool: enter your own point estimates and
// uncertainty for a monitoring question and read the trajectory
// classification. Unlike the step-4.4 explorer — which moves multipliers on
// the paper's chatbot case — this takes the four absolute estimates directly
// (H₁, H₂, E₁, E₂) so anyone can classify their own numbers. Shares the
// classifier and the quadrant chart with the walkthrough.
//
// Two columns (chart + reading · inputs) that fit a wide desktop viewport
// without scrolling; stacks and scrolls on narrow screens. Per-outcome
// guidance is revealed by hovering (or focusing / tapping) the quadrants in
// the chart — an info panel below swaps to that outcome and the chart
// highlights it.

import { useCallback, useEffect, useMemo, useState } from "react";
import { driver } from "driver.js";
import { QuadrantChart, type DotProps, type CloudPoint } from "@/components/viz/QuadrantChart";
import { Modal } from "@/components/Modal";
import { classify } from "@/lib/classifier";
import { chatbotCase, type Quadrant, type TrajectoryCategory } from "@/lib/case-data";
import { quadrantCopy, unclassifiableCopy } from "@/lib/quadrant-copy";

// First-visit guided tour (driver.js). Seen-state persists in localStorage;
// the "Take the tour" link replays it on demand.
const TOUR_KEY = "sortClassifierTourSeen";

function runTour() {
  driver({
    showProgress: true,
    popoverClass: "sort-tour",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Done",
    // Steps follow the actual usage flow: overview → harm → exposure →
    // uncertainty → results.
    steps: [
      {
        popover: {
          title: "Classify your own numbers",
          description:
            "Give the tool your harm and exposure estimates for two periods, say how sure you are, and it runs the classifier. Here's the flow — replay it anytime from “Take the tour.”",
        },
      },
      {
        element: '[data-tour="harm"]',
        popover: {
          title: "Start with harm",
          description:
            "Your best estimate of harmful events matching the question, in each of the two periods.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="exposure"]',
        popover: {
          title: "Then exposure",
          description:
            "The opportunities for that harm — uses, interactions, or population — in the same two periods. Only the ratios between periods matter.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="uncertainty"]',
        popover: {
          title: "Say how sure you are",
          description:
            "Wider uncertainty, or a bigger indifference band, sends more draws to Unclassifiable instead of forcing a false verdict.",
          side: "left",
          align: "center",
        },
      },
      {
        element: '[data-tour="results"]',
        popover: {
          title: "Read the result",
          description:
            "The grid places your case: exposure trend left → right, harm-per-exposure bottom → top. Hover any quadrant for what it means; the panel below names the most likely outcome and updates live.",
          side: "right",
          align: "center",
        },
      },
    ],
  }).drive();
}

type ToolParams = {
  h1: number;
  h2: number;
  e1: number;
  e2: number;
  uH: number;
  uE: number;
  eps: number;
};

// Prefilled with the walkthrough's chatbot case so the tool opens in a
// meaningful state; "reset to the example" restores these.
const EXAMPLE: ToolParams = {
  h1: chatbotCase.classification.classifierInputs.h1,
  h2: chatbotCase.classification.classifierInputs.h2,
  e1: chatbotCase.classification.classifierInputs.e1,
  e2: chatbotCase.classification.classifierInputs.e2,
  uH: chatbotCase.classification.classifierInputs.uH,
  uE: chatbotCase.classification.classifierInputs.uE,
  eps: chatbotCase.classification.classifierInputs.eps,
};

const QUADRANT_KEYS: Quadrant[] = ["escalating", "mitigating", "concentrating", "receding"];
const CATEGORY_KEYS: TrajectoryCategory[] = [...QUADRANT_KEYS, "unclassifiable"];

const CAT_COLORS: Record<TrajectoryCategory, string> = {
  escalating: "var(--escalating)",
  mitigating: "var(--mitigating-deep)",
  concentrating: "var(--concentrating)",
  receding: "var(--receding)",
  unclassifiable: "var(--ink-faint)",
};

// Quadrant hover zones as percentages of the chart's SVG box (viewBox
// 500×420, plot inset PAD.left/top 56/28, plot 416×336). Kept in sync with
// QuadrantChart's layout constants.
const ZONE = { left: "11.2%", midX: "52.8%", w: "41.6%", top: "6.667%", midY: "46.667%", h: "40%" };
const QUAD_ZONES: Record<Quadrant, { left: string; top: string }> = {
  concentrating: { left: ZONE.left, top: ZONE.top },
  escalating: { left: ZONE.midX, top: ZONE.top },
  receding: { left: ZONE.left, top: ZONE.midY },
  mitigating: { left: ZONE.midX, top: ZONE.midY },
};

const clamp01 = (v: number) => Math.min(0.98, Math.max(0.02, v));
const isPos = (v: number) => Number.isFinite(v) && v > 0;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const fmtMult = (v: number) => (Number.isFinite(v) ? `×${v.toFixed(2)}` : "—");

const copyFor = (cat: TrajectoryCategory) =>
  cat === "unclassifiable"
    ? { label: unclassifiableCopy.label, summary: unclassifiableCopy.summary }
    : { label: quadrantCopy[cat].label, summary: quadrantCopy[cat].summary };

const metaFor = (cat: TrajectoryCategory) =>
  cat === "unclassifiable"
    ? unclassifiableCopy.description
    : `${quadrantCopy[cat].trends.e} · ${quadrantCopy[cat].trends.h} — ${quadrantCopy[cat].description}`;

export function ClassifierTool() {
  const [params, setParams] = useState<ToolParams>(EXAMPLE);
  // Reseeds the (otherwise deterministic) Monte Carlo so the cloud and the
  // weights jitter within sampling noise — a read on how firm the numbers are.
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState<TrajectoryCategory | null>(null);
  const [readOpen, setReadOpen] = useState(false);
  const isExample = sameParams(params, EXAMPLE);

  const startTour = useCallback(() => {
    if (!document.querySelector('[data-tour="results"]')) return;
    runTour();
  }, []);

  // Auto-run the tour on the first visit only; a short delay lets the layout
  // settle so driver.js measures the targets correctly. The seen-flag is set
  // when the tour actually fires (not before), so a StrictMode double-mount in
  // dev still surfaces it once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(TOUR_KEY)) return;
    } catch {
      return; // storage blocked (private mode): skip auto-run rather than loop
    }
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(TOUR_KEY, "1");
      } catch {
        /* ignore */
      }
      startTour();
    }, 550);
    return () => window.clearTimeout(t);
  }, [startTour]);

  const valid =
    isPos(params.h1) &&
    isPos(params.h2) &&
    isPos(params.e1) &&
    isPos(params.e2) &&
    params.uH >= 1 &&
    params.uE >= 1 &&
    params.eps >= 0;

  const view = useMemo(() => {
    if (!valid) return null;
    const result = classify({
      h1: params.h1,
      h2: params.h2,
      e1: params.e1,
      e2: params.e2,
      uH: params.uH,
      uE: params.uE,
      eps: params.eps,
      seed: 0x505254 + run * 7919,
    });

    const dE = Math.log(params.e2 / params.e1);
    const dH = Math.log(params.h2 / params.h1) - dE;

    // Adaptive plot domain so the point-estimate dot always lands on-plot even
    // for large trends; matches the walkthrough's ×0.25–×6 window as a floor.
    const domain = Math.max(Math.log(6.5), 1.15 * Math.max(Math.abs(dE), Math.abs(dH), 1e-3));
    const toPlotX = (v: number) => 0.5 + v / (2 * domain);
    const toPlotY = (v: number) => 0.5 - v / (2 * domain);

    const top = QUADRANT_KEYS.reduce((a, b) => (result.weights[b] > result.weights[a] ? b : a));
    const hasQuadrantMass = result.weights[top] > 0;
    // The overall reading includes Unclassifiable, which often dominates.
    const dominant = CATEGORY_KEYS.reduce((a, b) =>
      result.weights[b] > result.weights[a] ? b : a,
    );

    const dot: DotProps = {
      x: clamp01(toPlotX(dE)),
      y: clamp01(toPlotY(dH)),
      color: hasQuadrantMass ? CAT_COLORS[top] : "var(--ink-faint)",
    };
    const cloud: CloudPoint[] = result.cloud
      .filter((p) => Math.abs(p.dE) <= domain && Math.abs(p.dH) <= domain)
      .map((p) => ({ x: toPlotX(p.dE), y: toPlotY(p.dH), category: p.category }));

    return {
      weights: result.weights,
      dot,
      cloud,
      activeQuadrant: hasQuadrantMass ? top : null,
      dominant,
      dominantWeight: result.weights[dominant],
      eMult: params.e2 / params.e1,
      hHatMult: Math.exp(dH),
    };
  }, [params, run, valid]);

  const set = (patch: Partial<ToolParams>) => setParams((p) => ({ ...p, ...patch }));

  // Which quadrant the chart highlights: the hovered one takes priority (but
  // Unclassifiable is off-grid, so it highlights nothing).
  const highlightQuad: Quadrant | null =
    hover && hover !== "unclassifiable" ? hover : (view?.activeQuadrant ?? null);

  return (
    <div className="grid gap-x-12 gap-y-10 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* ── CHART + reading ─────────────────────────────────────────────── */}
      <div data-tour="results" className="order-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-[520px] flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setReadOpen(true)}
              className="inline-flex items-center gap-2 font-body text-[13.5px] px-3 py-2 border border-ink-faint/45 text-ink-soft hover:border-accent-text hover:text-accent-text transition-colors"
            >
              <InfoGlyph />
              How to read this chart
            </button>
            <button
              type="button"
              onClick={startTour}
              className="font-display italic text-[12.5px] text-accent-text hover:underline whitespace-nowrap"
            >
              Take the tour
            </button>
          </div>
          <span className="font-display italic text-[12.5px] text-ink-soft text-right">
            Hover a quadrant to learn more
          </span>
        </div>

        <div className="relative w-full max-w-[520px]">
          {view ? (
            <QuadrantChart
              activeQuadrant={highlightQuad}
              dot={view.dot}
              weights={view.weights}
              showVerdict={false}
              cloud={view.cloud}
              dotAnimated={false}
            />
          ) : (
            <div className="w-full aspect-[500/420] border border-dashed border-ink-faint/50 flex items-center justify-center">
              <span className="font-display italic text-[15px] text-ink-soft px-6 text-center">
                Enter positive estimates to see the classification.
              </span>
            </div>
          )}

          {/* Hover zones aligned to the SVG plot area (top of the chart box). */}
          {view ? (
            <div className="pointer-events-none absolute left-0 top-0 w-full aspect-[500/420]">
              {QUADRANT_KEYS.map((q) => (
                <button
                  key={q}
                  type="button"
                  aria-label={`${quadrantCopy[q].label} quadrant — show what it means`}
                  onMouseEnter={() => setHover(q)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(q)}
                  onBlur={() => setHover(null)}
                  onClick={() => setHover((h) => (h === q ? null : q))}
                  className="pointer-events-auto absolute cursor-help outline-none hover:bg-accent/[0.05] focus-visible:bg-accent/[0.05]"
                  style={{
                    left: QUAD_ZONES[q].left,
                    top: QUAD_ZONES[q].top,
                    width: ZONE.w,
                    height: ZONE.h,
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Info panel: hovered outcome, else the live reading. */}
        {view ? (
          <div
            data-tour="reading"
            className="w-full max-w-[520px] mt-3 border-t border-rule pt-3 min-h-[104px]"
          >
            {hover ? (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] text-ink-soft">{metaFor(hover)}</span>
                  <span className="font-mono text-[12px] text-ink-soft">
                    {pct(view.weights[hover])} of draws
                  </span>
                </div>
                <p
                  className="font-display italic text-[19px] leading-tight mt-0.5"
                  style={{ color: CAT_COLORS[hover] }}
                >
                  {copyFor(hover).label}
                </p>
                <p className="font-body text-[13.5px] leading-[1.5] text-ink-soft mt-1">
                  {copyFor(hover).summary}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display italic text-[13px] text-ink-soft">
                    Most likely outcome
                  </span>
                  <span className="font-mono text-[12px] text-ink-soft">
                    exposure {fmtMult(view.eMult)} · harm/exposure {fmtMult(view.hHatMult)}
                  </span>
                </div>
                <p
                  className="font-display italic text-[19px] leading-tight mt-0.5"
                  style={{ color: CAT_COLORS[view.dominant] }}
                >
                  {copyFor(view.dominant).label} — {pct(view.dominantWeight)}
                </p>
                <p className="font-body text-[13.5px] leading-[1.5] text-ink-soft mt-1">
                  {copyFor(view.dominant).summary}
                </p>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* ── Inputs ──────────────────────────────────────────────────────── */}
      {/* No overflow clipping here: a scroll container would also clip the
          hint tooltips on the sides. The inputs are short enough to fit. */}
      <div className="order-2 xl:min-h-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-1">
          <span className="font-display italic text-[15px] text-ink">Your estimates</span>
          <span className="flex items-baseline gap-3">
            <button
              type="button"
              onClick={() => setRun((r) => r + 1)}
              className="font-display italic text-[13px] text-accent-text hover:underline cursor-pointer"
            >
              ↻ new draws
            </button>
            <span aria-hidden className="text-ink-faint text-[12px]">
              ·
            </span>
            <button
              type="button"
              onClick={() => setParams(EXAMPLE)}
              disabled={isExample}
              className={
                "font-display italic text-[13px] transition-colors " +
                (isExample
                  ? "text-ink-faint/60 cursor-default"
                  : "text-accent-text hover:underline cursor-pointer")
              }
            >
              reset to the example
            </button>
          </span>
        </div>
        <p className="font-body text-[13px] leading-[1.5] text-ink-soft mb-1">
          Pick two comparison periods for one monitoring question and give your best point estimate
          for each quantity. Counts can be raw numbers — only the ratios between periods matter.
        </p>

        <FieldGroup
          tour="harm"
          label="Harm (H)"
          desc="Harmful events matching the question — the numerator. Estimate the level in each period from the strongest sources you have."
        >
          <CountField
            label="Period 1 · H₁"
            hint="Best point estimate of harmful events in the earlier period."
            value={params.h1}
            onChange={(v) => set({ h1: v })}
          />
          <CountField
            label="Period 2 · H₂"
            hint="Best point estimate of harmful events in the later period."
            value={params.h2}
            onChange={(v) => set({ h2: v })}
          />
        </FieldGroup>

        <FieldGroup
          tour="exposure"
          label="Exposure (E)"
          desc="Opportunities for that harm — the denominator. Uses, interactions, or population that match the monitoring question in each period."
        >
          <CountField
            label="Period 1 · E₁"
            hint="Opportunities for harm in the earlier period."
            value={params.e1}
            onChange={(v) => set({ e1: v })}
          />
          <CountField
            label="Period 2 · E₂"
            hint="Opportunities for harm in the later period."
            value={params.e2}
            onChange={(v) => set({ e2: v })}
          />
        </FieldGroup>

        <FieldGroup
          tour="uncertainty"
          label="Uncertainty"
          desc="How much you trust the estimates. Bigger factors and a wider band mean more draws land Unclassifiable rather than forcing a false verdict."
        >
          <NumberField
            label="Harm factor · u_H"
            hint="The true harm lies between ÷u and ×u of your estimate with 95% probability. Must be ≥ 1 (1 = perfectly certain; 2 = could be off by up to 2×)."
            value={params.uH}
            min={1}
            step={0.1}
            onChange={(v) => set({ uH: v })}
          />
          <NumberField
            label="Exposure factor · u_E"
            hint="Same idea for exposure: the true value lies between ÷u and ×u of your estimate with 95% probability. Must be ≥ 1."
            value={params.uE}
            min={1}
            step={0.1}
            onChange={(v) => set({ uE: v })}
          />
          <NumberField
            label="Indifference band · ε"
            hint="How large a trend must be, in log units (≈ fractional change), before it counts as a real rise or fall. A trend inside ±ε is treated as flat → Unclassifiable. 0.05 ≈ 5%."
            value={params.eps}
            min={0}
            step={0.01}
            onChange={(v) => set({ eps: v })}
          />
        </FieldGroup>

        {!valid ? (
          <p className="mt-2 font-body text-[13px] text-note leading-snug">
            Harm and exposure must be positive; the uncertainty factors must be at least 1.
          </p>
        ) : null}
      </div>

      <Modal open={readOpen} onClose={() => setReadOpen(false)} title="How to read this chart">
        <div className="font-body text-[14px] leading-[1.6] text-ink-soft space-y-3">
          <p>
            Harm and exposure are estimated <em className="italic">independently</em>, then read
            together — decoupling the two is the point of the framework.
          </p>
          <p>
            The <strong className="font-semibold text-ink">horizontal axis</strong> is the exposure
            trend (E): how the opportunity for harm changed between your two periods — decreasing to
            the left, increasing to the right.
          </p>
          <p>
            The <strong className="font-semibold text-ink">vertical axis</strong> is the
            harm-per-exposure trend (Ĥ): whether each use is getting safer or more dangerous —
            decreasing at the bottom, increasing at the top. The two directions pick the quadrant.
          </p>
          <p>
            Because every estimate carries uncertainty, the answer is a{" "}
            <em className="italic">distribution</em>, not a single cell. Each faint point is one
            Monte Carlo draw of the four quantities; the percentages weigh how firmly the evidence
            points one way, rather than claiming a literal probability. Draws too flat or too
            uncertain to place land as <em className="italic">Unclassifiable</em>.
          </p>
        </div>
      </Modal>
    </div>
  );
}

// ── Inputs ──────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-[136px] border border-ink-faint/55 bg-white px-2 py-1 font-mono text-[13px] text-ink text-right outline-none focus:border-accent-text";

function FieldGroup({
  label,
  desc,
  tour,
  children,
}: {
  label: string;
  desc: string;
  tour?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset data-tour={tour} className="mt-3 pt-2.5 border-t border-rule">
      <legend className="font-display italic text-[14px] text-ink">{label}</legend>
      <p className="font-body text-[12px] leading-[1.45] text-ink-soft mb-2">{desc}</p>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function FieldShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-baseline justify-between gap-3">
      <span className="font-display italic text-[13px] text-ink-soft">
        {label}
        <Hint text={hint} />
      </span>
      {children}
    </label>
  );
}

// Count input: text field with thousands separators. While focused it shows
// the raw digits for natural typing; on blur it renders with commas. Parsing
// strips any non-numeric characters so pasted "2,400,000" works.
function CountField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");
  const display = focused ? raw : Number.isFinite(value) ? value.toLocaleString("en-US") : "";
  return (
    <FieldShell label={label} hint={hint}>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onFocus={() => {
          setRaw(Number.isFinite(value) ? String(value) : "");
          setFocused(true);
        }}
        onChange={(e) => {
          setRaw(e.target.value);
          const cleaned = e.target.value.replace(/[^0-9.]/g, "");
          onChange(cleaned === "" ? NaN : Number(cleaned));
        }}
        onBlur={() => setFocused(false)}
        className={INPUT_CLASS}
        aria-label={label}
      />
    </FieldShell>
  );
}

function NumberField({
  label,
  hint,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <FieldShell label={label} hint={hint}>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step ?? "any"}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
        className={INPUT_CLASS}
        aria-label={label}
      />
    </FieldShell>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <span className="group relative ml-1 inline-block align-middle">
      <span
        tabIndex={0}
        role="img"
        aria-label={text}
        className="inline-flex h-[13px] w-[13px] items-center justify-center rounded-full border border-ink-faint font-body text-[9px] leading-none text-ink-soft cursor-help select-none outline-none focus-visible:border-accent-text focus-visible:text-accent-text"
      >
        ?
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full right-0 z-20 mb-1.5 w-[230px] border border-rule bg-white px-2.5 py-1.5 font-body not-italic text-[12px] leading-snug text-ink-soft shadow-[0_2px_10px_rgba(1,25,52,0.10)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function InfoGlyph() {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-body leading-none"
    >
      i
    </span>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────

function sameParams(a: ToolParams, b: ToolParams) {
  return (
    a.h1 === b.h1 &&
    a.h2 === b.h2 &&
    a.e1 === b.e1 &&
    a.e2 === b.e2 &&
    a.uH === b.uH &&
    a.uE === b.uE &&
    a.eps === b.eps
  );
}

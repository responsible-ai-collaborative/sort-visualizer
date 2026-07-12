"use client";

import { useEffect, useMemo, useState } from "react";
import { QuadrantChart, type DotProps, type CloudPoint } from "@/components/viz/QuadrantChart";
import { ClassifierControls, type ExplorerParams } from "@/components/viz/ClassifierControls";
import { resolveAct4 } from "@/lib/step-config";
import { chatbotCase, type Quadrant } from "@/lib/case-data";
import { classify } from "@/lib/classifier";

// The chatbot case lands in the mitigating quadrant: Ĥ ↓ (×~0.55), E ↑ (×~3).
// Lower-right. The deep token keeps the dot legible on the light background.
const CHATBOT_DOT: DotProps = {
  x: 0.78,
  y: 0.78,
  color: "var(--mitigating-deep)",
};

const INPUTS = chatbotCase.classification.classifierInputs;

const PAPER_PARAMS: ExplorerParams = {
  hMult: INPUTS.h2 / INPUTS.h1,
  eMult: INPUTS.e2 / INPUTS.e1,
  uH: INPUTS.uH,
  uE: INPUTS.uE,
  eps: INPUTS.eps,
};

// Plot domain for the explorer: log-trends in [-ln 6.5, +ln 6.5] map onto
// the plot square (covers the slider range ×0.25–×6 with margin). Cloud
// draws outside the domain are dropped rather than piled up at the edges.
const DOMAIN = Math.log(6.5);
const toPlotX = (dE: number) => 0.5 + dE / (2 * DOMAIN);
const toPlotY = (dH: number) => 0.5 - dH / (2 * DOMAIN);
const clamp01 = (v: number) => Math.min(0.98, Math.max(0.02, v));

const QUADRANT_KEYS: Quadrant[] = ["escalating", "mitigating", "concentrating", "receding"];

const DOT_COLORS: Record<Quadrant, string> = {
  escalating: "var(--escalating)",
  mitigating: "var(--mitigating-deep)",
  concentrating: "var(--concentrating)",
  receding: "var(--receding)",
};

export function Act4Quadrant({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct4(activeStep);
  const [params, setParams] = useState<ExplorerParams>(PAPER_PARAMS);
  // Bumped by the "new draws" button: reseeds the (otherwise deterministic)
  // Monte Carlo, refreshing the cloud and letting the weights jitter within
  // sampling noise — a tangible read on how firm the reported numbers are.
  const [run, setRun] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isDefault = params === PAPER_PARAMS;

  // Leaving the explorer step unmounts the sheet's DOM but not this state —
  // reset it so scrolling away and back doesn't reopen the sheet unbidden.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!state.explore) setSheetOpen(false);
  }, [state.explore]);

  const result = useMemo(() => {
    if (!state.explore) return null;
    return classify({
      h1: INPUTS.h1,
      h2: INPUTS.h1 * params.hMult,
      e1: INPUTS.e1,
      e2: INPUTS.e1 * params.eMult,
      uH: params.uH,
      uE: params.uE,
      eps: params.eps,
      floorH1: INPUTS.floorH1,
      floorH2: INPUTS.floorH2,
      seed: 0x505254 + run * 7919,
    });
  }, [state.explore, params, run]);

  // Point-estimate trends drive the dot; the weights color it by the most
  // probable quadrant so a slider push across an axis reads immediately.
  const explorer = useMemo(() => {
    if (!result) return null;
    const dE = Math.log(params.eMult);
    const dH = Math.log(params.hMult) - Math.log(params.eMult);
    const top = QUADRANT_KEYS.reduce((a, b) => (result.weights[b] > result.weights[a] ? b : a));
    const hasQuadrantMass = result.weights[top] > 0;
    return {
      dot: {
        x: clamp01(toPlotX(dE)),
        y: clamp01(toPlotY(dH)),
        color: hasQuadrantMass ? DOT_COLORS[top] : "var(--ink-faint)",
      } satisfies DotProps,
      cloud: result.cloud
        .filter((p) => Math.abs(p.dE) <= DOMAIN && Math.abs(p.dH) <= DOMAIN)
        .map((p): CloudPoint => ({ x: toPlotX(p.dE), y: toPlotY(p.dH), category: p.category })),
      activeQuadrant: hasQuadrantMass ? top : null,
    };
  }, [result, params]);

  if (state.explore && explorer && result) {
    return (
      <div className="w-full max-w-[560px]">
        <QuadrantChart
          activeQuadrant={explorer.activeQuadrant}
          dot={explorer.dot}
          weights={result.weights}
          showVerdict={false}
          cloud={explorer.cloud}
          dotAnimated={false}
          svgClassName="max-md:h-[calc(40vh-165px)] max-md:w-auto max-md:mx-auto"
        />
        {/* Desktop: sliders live under the chart. Below md they don't fit
            the 40vh pin, so a button opens them in a bottom sheet — the
            chart stays visible in the pin above it and updates live. */}
        <div className="max-md:hidden">
          <ClassifierControls
            params={params}
            onChange={setParams}
            onReset={() => setParams(PAPER_PARAMS)}
            onRerun={() => setRun((r) => r + 1)}
            isDefault={isDefault}
          />
        </div>
        <div className="md:hidden flex justify-center mt-1">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            className="inline-flex items-center gap-2 font-body text-[13px] px-3.5 py-1.5 border border-accent text-accent bg-white hover:bg-accent hover:text-white transition-colors"
          >
            Adjust the assumptions
          </button>
        </div>
        <ControlsSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <ClassifierControls
            params={params}
            onChange={setParams}
            onReset={() => setParams(PAPER_PARAMS)}
            onRerun={() => setRun((r) => r + 1)}
            isDefault={isDefault}
          />
        </ControlsSheet>
      </div>
    );
  }

  return (
    <QuadrantChart
      activeQuadrant={state.activeQuadrant}
      dot={state.dot ? CHATBOT_DOT : null}
      weights={state.weights ? chatbotCase.classification.weights : null}
      showVerdict={state.verdict}
      verdictDetail={chatbotCase.classification.verdict}
    />
  );
}

// Bottom sheet for the slider panel below md: slides over the lower half of
// the screen with no backdrop, so the quadrant chart pinned above stays
// visible while the sliders drive it live.
function ControlsSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-rule shadow-[0_-10px_36px_rgba(1,25,52,0.20)] max-h-[52vh] overflow-y-auto px-4 pb-6 pt-1.5"
      role="dialog"
      aria-label="Classifier inputs"
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close classifier inputs"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rule text-ink-faint text-[13px] hover:border-accent-text hover:text-accent-text transition-colors"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  );
}

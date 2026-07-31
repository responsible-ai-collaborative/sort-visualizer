"use client";

import { useReducedMotion } from "framer-motion";
import { resolveExposure } from "@/lib/step-config";
import { chatbotCase } from "@/lib/case-data";
import type { FunnelRow } from "@/lib/case-data";
import {
  PanelHeader,
  SourceCard,
  SourceLinks,
  ConclusionBar,
  EstimatePair,
  useRevealOnMount,
} from "./shared";

// Steps 3.5–3.6 build the EXPOSURE panel: the proxy funnel (WAU → traffic
// share → US share), then the ×0.15% row with the final 4M → 12M estimate.
// All numbers come from chatbotCase.exposure.

const funnel = chatbotCase.exposure.funnel;
const baseRows = funnel.slice(0, 3);
const rateRow = funnel[3];
const harmConclusion = chatbotCase.harm.conclusion;

export function ExposurePanel({ activeStep }: { activeStep: string | null }) {
  const state = resolveExposure(activeStep);
  const reduced = !!useReducedMotion();
  // Below md only the current step's cards fit the 40vh pin: 3.5 shows the
  // base funnel rows, 3.6 swaps them for the rate row + estimate + trend.
  const atRate = activeStep === "3.6";

  return (
    // Desktop: fill the pin as a flex column so the header stays fixed and only
    // the card box scrolls (see ScrollySection stackTop). Mobile is unchanged.
    <div className="w-full max-w-[640px] md:flex-1 md:flex md:flex-col md:min-h-0">
      <PanelHeader
        letter="E"
        title="Estimating exposure"
        carryover={
          <>
            H ✓ · Increasing {harmConclusion.multiplierDisplay}
            <br />
            Tier {harmConclusion.confidenceTier} · {harmConclusion.confidenceLabel}
          </>
        }
      />

      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
        {/* Below md the step text already defines exposure — the line costs
            more pin height than it earns. */}
        <p className="max-md:hidden font-display italic text-[14px] leading-snug text-ink-faint mb-3">
          {chatbotCase.exposure.definition}
        </p>

      <div className="space-y-1.5 md:space-y-2">
        {state.funnel &&
          baseRows.map((row, i) => (
            <FunnelRowCard
              key={row.label}
              row={row}
              reduced={reduced}
              revealDelay={i * 0.15}
              className={atRate ? "max-md:hidden" : ""}
            />
          ))}

        {/* The ×0.15% row is narrated by the 3.6 step text, so below md the
            pin shows just the estimate + trend it produces. */}
        {state.rate && (
          <FunnelRowCard row={rateRow} reduced={reduced} className="max-md:hidden" accent />
        )}

        {state.conclusion && (
          <SourceCard
            tag="Final estimate"
            role="Conversations matching [O] · 2024 → 2025"
            reduced={reduced}
            revealDelay={0.15}
          >
            <EstimatePair estimates={chatbotCase.exposure.estimates} />
          </SourceCard>
        )}
        </div>

        {state.conclusion && (
          <ConclusionBar conclusion={chatbotCase.exposure.conclusion} reduced={reduced} />
        )}
      </div>
    </div>
  );
}

function FunnelRowCard({
  row,
  className,
  accent,
  reduced,
  revealDelay = 0,
}: {
  row: FunnelRow;
  className?: string;
  accent?: boolean;
  reduced: boolean;
  revealDelay?: number;
}) {
  const ref = useRevealOnMount<HTMLDivElement>(reduced, revealDelay);
  return (
    <div
      ref={ref}
      className={`${className ?? ""} opacity-0 border border-rule px-3 py-1.5 md:px-4 md:py-3 flex items-baseline justify-between gap-3 md:gap-4`}
      style={{
        background: accent ? "rgba(1, 25, 52, 0.05)" : "rgba(255, 255, 255, 0.7)",
      }}
    >
      <div className="min-w-0">
        {row.operation ? (
          <div className="font-display italic text-[12px] md:text-[13px] text-accent-text mb-0.5">
            {row.operation}
          </div>
        ) : null}
        <div className="font-body text-[13px] md:text-[15px] leading-tight text-ink font-semibold">
          {row.label}
        </div>
      </div>
      <div className="text-right max-w-[230px]">
        <div className="font-mono text-[10px] md:text-[11px] text-ink-soft leading-snug">
          {row.detail}
        </div>
        <SourceLinks links={row.sourceLinks} />
      </div>
    </div>
  );
}

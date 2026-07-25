"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { resolveHarm } from "@/lib/step-config";
import { chatbotCase } from "@/lib/case-data";
import {
  PanelHeader,
  SourceCard,
  ConclusionBar,
  EstimatePair,
  BarPair,
  animateCardIn,
  animateConclusionIn,
} from "./shared";

// Steps 3.1–3.4 build the HARM panel: the OpenAI point-estimate card (the
// anchor), the 2.4M → 4M estimate figures, then the AIID card as an
// uncertainty check on the lower band, and finally the conclusion. All
// numbers come from chatbotCase.harm.

const aiid = chatbotCase.harm.incidentCheck;
const pointEstimate = chatbotCase.harm.pointEstimate;

// Below md only the card(s) the active step discusses fit the 40vh pin, so
// the rest collapse (desktop keeps the full accumulating stack).
const MOBILE_VISIBLE: Record<string, readonly string[]> = {
  "3.1": ["point"],
  "3.2": ["estimates"],
  "3.3": ["aiid"],
  "3.4": ["estimates", "conclusion"],
};

export function HarmPanel({ activeStep }: { activeStep: string | null }) {
  const state = resolveHarm(activeStep);
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = activeStep ? MOBILE_VISIBLE[activeStep] : undefined;
  const mobileHide = (key: string) => (visible && !visible.includes(key) ? " max-md:hidden" : "");

  useGSAP(
    () => {
      if (state.pointEstimate) animateCardIn(".harm-point", reduced);
      if (state.estimates) animateCardIn(".harm-estimates", reduced);
      if (state.aiid) animateCardIn(".harm-aiid", reduced);
      if (state.conclusion) animateConclusionIn(".harm-conclusion", reduced);
    },
    {
      scope: ref,
      dependencies: [state.pointEstimate, state.estimates, state.aiid, state.conclusion, reduced],
    },
  );

  return (
    <div ref={ref} className="w-full max-w-[640px]">
      <PanelHeader letter="H" title="Estimating harm" />

      <div className="space-y-2 md:space-y-3">
        {state.pointEstimate && (
          <SourceCard
            tag="OpenAI"
            role="Point estimate · Tier 2"
            sources={pointEstimate.sourceLinks}
            className={"harm-point opacity-0" + mobileHide("point")}
          >
            <RatioViz />
            <p className="font-body italic text-[12px] leading-snug text-ink-faint pt-2">
              <span className="text-ink">{pointEstimate.rateDisplay}</span> have{" "}
              {pointEstimate.rateNote}; the disclosed share of{" "}
              <span className="text-ink">undesired responses</span> (dark) shrinks across the three
              periods.
            </p>
          </SourceCard>
        )}

        {state.estimates && (
          <SourceCard
            tag="Point estimate"
            role="Harmful conversations · 2024 → 2025"
            className={"harm-estimates opacity-0" + mobileHide("estimates")}
          >
            <EstimatePair estimates={pointEstimate.estimates} />
          </SourceCard>
        )}

        {state.aiid && (
          <SourceCard
            tag="AIID"
            role="Uncertainty check · lower band"
            sources={aiid.sourceLinks}
            className={"harm-aiid opacity-0" + mobileHide("aiid")}
          >
            <div className="flex max-md:flex-col items-center gap-3 md:gap-5">
              <BarPair
                v1={aiid.matches[0].value}
                v2={aiid.matches[1].value}
                max={15}
                rootClass="harm-aiid"
                reduced={reduced}
              />
              <p className="font-body italic text-[12px] md:text-[13px] leading-snug text-ink-soft flex-1">
                LLM-assisted scan of the <span className="text-ink">AI Incident Database</span>.{" "}
                <span className="text-ink">{aiid.note}</span>{" "}
                <span className="max-md:hidden">
                  Recorded counts sit far below the point estimate — they only nudge the lower band
                  of its uncertainty interval.
                </span>
              </p>
            </div>
          </SourceCard>
        )}
      </div>

      {state.conclusion && (
        <ConclusionBar
          className={"harm-conclusion" + mobileHide("conclusion")}
          conclusion={chatbotCase.harm.conclusion}
        />
      )}
    </div>
  );
}

// Three stacked desired/undesired response-ratio rows.
function RatioViz() {
  return (
    <div className="space-y-2">
      {pointEstimate.ratios.map((r) => (
        <div
          key={r.period}
          className="grid grid-cols-[110px_1fr_60px] items-center gap-3 font-mono text-[11px]"
        >
          <span className="text-ink-faint">{r.period}</span>
          <div className="h-2.5 bg-rule/50 relative overflow-hidden flex">
            <div
              className="h-full"
              style={{ width: `${r.desired}%`, background: "var(--accent-soft)" }}
            />
            <div
              className="h-full"
              style={{ width: `${r.undesired}%`, background: "var(--accent)" }}
            />
          </div>
          <span className="text-right text-accent-text font-semibold">
            {r.desired}:{r.undesired}
          </span>
        </div>
      ))}
      <div className="flex gap-4 pt-1 font-body text-[12px] text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2" style={{ background: "var(--accent-soft)" }} />
          desired responses
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2" style={{ background: "var(--accent)" }} />
          undesired
        </span>
      </div>
    </div>
  );
}

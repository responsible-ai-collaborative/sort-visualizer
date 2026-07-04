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

// Steps 3.1–3.4 build the HARM panel: two lower-bound cards (AIID, OECD
// AIM), the OpenAI point-estimate card, then the conclusion with the big
// 2.4M → 4M figures. All numbers come from chatbotCase.harm.

const [aiid, oecd] = chatbotCase.harm.lowerBounds;
const pointEstimate = chatbotCase.harm.pointEstimate;

export function HarmPanel({ activeStep }: { activeStep: string | null }) {
  const state = resolveHarm(activeStep);
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (state.aiid) animateCardIn(".harm-aiid", reduced);
      if (state.oecd) animateCardIn(".harm-oecd", reduced);
      if (state.pointEstimate) animateCardIn(".harm-point", reduced);
      if (state.conclusion) {
        animateCardIn(".harm-estimates", reduced);
        animateConclusionIn(".harm-conclusion", reduced);
      }
    },
    {
      scope: ref,
      dependencies: [state.aiid, state.oecd, state.pointEstimate, state.conclusion, reduced],
    },
  );

  return (
    <div ref={ref} className="w-full max-w-[640px]">
      <PanelHeader letter="H" role="Variable H" title="Estimating harm" />

      <div className="space-y-3">
        {state.aiid && (
          <SourceCard tag="AIID" role="Lower bound · full matches" className="harm-aiid opacity-0">
            <div className="flex items-center gap-5">
              <BarPair
                v1={aiid.matches[0].value}
                v2={aiid.matches[1].value}
                max={15}
                rootClass="harm-aiid"
                reduced={reduced}
              />
              <p className="font-body italic text-[13px] leading-snug text-ink-soft flex-1">
                LLM-assisted scan of the <span className="text-ink">AI Incident Database</span>.{" "}
                <span className="text-ink">{aiid.note}</span> Composite narratives — not individual
                cases — drive the 2025 spread.
              </p>
            </div>
          </SourceCard>
        )}

        {state.oecd && (
          <SourceCard
            tag="OECD AIM"
            role="Lower bound · full matches"
            className="harm-oecd opacity-0"
          >
            <div className="flex items-center gap-5">
              <BarPair
                v1={oecd.matches[0].value}
                v2={oecd.matches[1].value}
                max={80}
                rootClass="harm-oecd"
                reduced={reduced}
              />
              <p className="font-body italic text-[13px] leading-snug text-ink-soft flex-1">
                Different sourcing pipeline; most matches are duplicates, lawsuits, or composite
                narratives. <span className="text-ink">{oecd.note}</span>
              </p>
            </div>
          </SourceCard>
        )}

        {state.pointEstimate && (
          <SourceCard tag="OpenAI" role="Point estimate · Tier 2" className="harm-point opacity-0">
            <RatioViz />
            <p className="font-body italic text-[12px] leading-snug text-ink-faint pt-2">
              <span className="text-ink">{pointEstimate.rateDisplay}</span> have{" "}
              {pointEstimate.rateNote}; the disclosed share of{" "}
              <span className="text-ink">undesired responses</span> (dark) shrinks across the three
              periods.
            </p>
          </SourceCard>
        )}

        {state.conclusion && (
          <SourceCard
            tag="Point estimate"
            role="Harmful conversations · 2024 → 2025"
            className="harm-estimates opacity-0"
          >
            <EstimatePair estimates={pointEstimate.estimates} />
          </SourceCard>
        )}
      </div>

      {state.conclusion && (
        <ConclusionBar className="harm-conclusion" conclusion={chatbotCase.harm.conclusion} />
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

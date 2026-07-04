"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TierBadge } from "@/components/TierBadge";

type TierNum = 1 | 2 | 3 | 4;
type TierLabel = "High" | "Medium" | "Low" | "—";

type TierRow = {
  tier: TierNum;
  method: string;
  sensitiveTo: string;
  confidence: TierLabel;
  body: ReactNode;
};

const ROWS: TierRow[] = [
  {
    tier: 1,
    method: "Direct measurement",
    sensitiveTo: "Authoritative source",
    confidence: "High",
    body: (
      <p>
        The estimate is read directly from an authoritative source: vehicle crash filings,
        pharmacovigilance registries, platform transparency reports.
      </p>
    ),
  },
  {
    tier: 2,
    method: "Combine proxy measures",
    sensitiveTo: "Proxy construction",
    confidence: "Medium",
    body: (
      <p>
        No single source is complete, so a point estimate is constructed by combining partial
        sources and proxy measures. For harm, public incident databases supply a hard lower bound —
        the true harm cannot fall below what has already been recorded. Exposure has no such floor;
        it must be proxied end to end.
      </p>
    ),
  },
  {
    tier: 3,
    method: "Expert elicitation",
    sensitiveTo: "Panel selection",
    confidence: "Low",
    body: (
      <p>
        No quantitative source supports even a rough estimate. Domain experts are asked to bound the
        plausible range.
      </p>
    ),
  },
  {
    tier: 4,
    method: "Abstain",
    sensitiveTo: "—",
    confidence: "—",
    body: (
      <p>
        Where the plausible range spans more than two orders of magnitude, or no expert consensus is
        reachable, the estimate is withheld. A valid finding in its own right: current evidence
        cannot support even an order-of-magnitude claim.
      </p>
    ),
  },
];

export function TierTable(_props: { activeStep: string | null }) {
  const [expanded, setExpanded] = useState<TierNum | null>(null);
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.32;

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-4 flex items-baseline justify-between gap-3 pb-3 border-b border-rule">
        <div>
          <div className="font-display italic text-[14px] text-ink-faint">Estimation methods</div>
          <h3 className="font-display text-[23px] leading-tight text-ink font-medium mt-1">
            Four tiers of source reliability
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-[28px_1fr_auto] gap-x-4 px-1 pb-2 font-display italic text-[13px] text-ink-faint">
        <span>Tier</span>
        <span>Method</span>
        <span>Confidence</span>
      </div>

      <ul className="space-y-2">
        {ROWS.map((row) => {
          const isOpen = expanded === row.tier;
          return (
            <li key={row.tier}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : row.tier)}
                aria-expanded={isOpen}
                className="group w-full text-left border border-rule px-4 py-3 transition-colors hover:border-accent/40 cursor-pointer"
                style={{ background: "rgba(255, 255, 255, 0.7)" }}
              >
                <div className="grid grid-cols-[28px_1fr_auto] gap-x-4 items-center">
                  <span className="font-display font-bold text-[20px] leading-none text-accent-text">
                    {row.tier}
                  </span>
                  <div>
                    <div className="font-body text-[15px] leading-tight text-ink">{row.method}</div>
                    <div className="font-display italic text-[13px] text-ink-faint mt-1">
                      Sensitive to: {row.sensitiveTo}
                    </div>
                  </div>
                  {row.confidence === "—" ? (
                    <span className="font-display italic text-[14px] text-ink-faint px-2.5 py-1 border border-rule">
                      Abstain
                    </span>
                  ) : (
                    <TierBadge tier={row.tier as 1 | 2 | 3} label={row.confidence} />
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration, ease: [0.22, 0.61, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-rule font-body italic text-[14px] leading-snug text-ink-soft">
                        {row.body}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 font-display italic text-[14px] text-ink-faint">
        Click a row to read more.
      </p>
    </div>
  );
}

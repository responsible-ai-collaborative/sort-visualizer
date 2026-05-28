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
    method: "Direct retrieval",
    sensitiveTo: "Authoritative source",
    confidence: "High",
    body: (
      <p>
        The estimate is read directly from an authoritative source: mandatory
        regulatory filings (NHTSA crash reports), pharmacovigilance registries,
        audited platform transparency reports.
      </p>
    ),
  },
  {
    tier: 2,
    method: "Combine proxies / records",
    sensitiveTo: "Proxy construction",
    confidence: "Medium",
    body: (
      <p>
        No single source is complete, so bounds are built from partial data.
        Harm has a natural lower bound — the count of incidents already
        captured in public databases — and an upper bound from proxy measures.
        Exposure has no natural lower bound; both ends must be proxied.
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
        No quantitative source supports even a rough estimate. Domain experts
        are asked to bound the plausible range.
      </p>
    ),
  },
  {
    tier: 4,
    method: "Principled abstention",
    sensitiveTo: "—",
    confidence: "—",
    body: (
      <p>
        Where the plausible range spans more than two orders of magnitude, or
        no expert consensus is reachable, the estimate is withheld. A valid
        finding in its own right: current evidence cannot support even an
        order-of-magnitude claim.
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
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            Estimation methods
          </div>
          <h3 className="font-display text-[22px] leading-tight text-ink font-semibold mt-1">
            Four tiers of source reliability
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-[28px_1fr_auto] gap-x-4 px-1 pb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
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
                    <div className="font-body text-[15px] leading-tight text-ink">
                      {row.method}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint mt-1">
                      Sensitive to: {row.sensitiveTo}
                    </div>
                  </div>
                  {row.confidence === "—" ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint px-2 py-1 border border-rule">
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

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        Click a row to read more.
      </p>
    </div>
  );
}

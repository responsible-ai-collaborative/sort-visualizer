"use client";

// The four estimation tiers, shown in a modal reachable from any tier
// mention in the walkthrough. Per the 2026-07-08 sync, reliability detail
// lives at its points of use — there is no standalone tier slide.

import { useState, type ReactNode } from "react";
import { Modal } from "@/components/Modal";
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
        sources and proxy measures. For harm, public incident databases can back-stop the estimate:
        where their recorded counts approach it, they raise the lower band of its uncertainty
        interval. Exposure has no such backstop; it must be proxied end to end.
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

// Trigger that opens the tier reference. Pass `tier` to highlight the tier the
// surrounding estimate sits at. `variant` picks the look: "link" (default)
// reads like the walkthrough's other inline links; "button" renders a
// standalone bordered box matching the secondary buttons elsewhere.
export function TierLink({
  tier,
  variant = "link",
  children,
}: {
  tier?: TierNum;
  variant?: "link" | "button";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const triggerClass =
    variant === "button"
      ? "inline-flex items-center font-body text-[14px] md:text-[15px] px-4 py-2 md:py-2.5 border border-rule text-ink bg-[rgba(255,255,255,0.5)] hover:border-accent/60 hover:bg-white focus-visible:border-accent transition-colors outline-none"
      : "inline align-baseline cursor-pointer underline decoration-accent-text/40 hover:decoration-accent-text text-accent-text outline-none focus-visible:decoration-accent-text";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        {children}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Four tiers of source reliability"
        accent="var(--accent-text)"
      >
        <p className="font-body text-[14px] leading-[1.55] text-ink-soft mb-4">
          Every estimate rests on whatever sources the data environment makes available, and those
          sources vary widely in how directly they speak to the question. The paper grades
          estimation methods into four tiers by the strength of the underlying evidence.
        </p>
        <ul className="space-y-2.5">
          {ROWS.map((row) => {
            const isCurrent = row.tier === tier;
            return (
              <li
                key={row.tier}
                className={`border px-4 py-3 ${isCurrent ? "border-accent" : "border-rule"}`}
                style={{ background: "rgba(255,255,255,0.7)" }}
              >
                <div className="grid grid-cols-[24px_1fr_auto] gap-x-3 items-center">
                  <span className="font-display font-bold text-[19px] leading-none text-accent-text">
                    {row.tier}
                  </span>
                  <div>
                    <div className="font-body text-[15px] leading-tight text-ink">
                      {row.method}
                      {isCurrent && (
                        <span className="font-display italic text-[13px] text-accent-text">
                          {" "}
                          — this estimate
                        </span>
                      )}
                    </div>
                    <div className="font-display italic text-[13px] text-ink-faint mt-0.5">
                      Sensitive to: {row.sensitiveTo}
                    </div>
                  </div>
                  {row.confidence === "—" ? (
                    <span className="font-display italic text-[13px] text-ink-faint px-2 py-0.5 border border-rule">
                      Abstain
                    </span>
                  ) : (
                    <TierBadge tier={row.tier as 1 | 2 | 3} label={row.confidence} />
                  )}
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-rule font-body italic text-[13px] leading-snug text-ink-soft">
                  {row.body}
                </div>
              </li>
            );
          })}
        </ul>
      </Modal>
    </>
  );
}

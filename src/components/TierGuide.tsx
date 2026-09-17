"use client";

// The four methodological tiers and their uncertainty factors, shown in a
// modal reachable from any tier mention in the walkthrough. Tier detail lives
// at its points of use — there is no standalone tier slide.

import { useState, type ReactNode } from "react";
import { Modal } from "@/components/Modal";

type TierNum = 1 | 2 | 3 | 4;

type TierRow = {
  tier: TierNum;
  uf: string;
  color?: string;
  body: ReactNode;
};

const ROWS: TierRow[] = [
  {
    tier: 1,
    uf: "≥ 1",
    color: "var(--mitigating-deep)",
    body: (
      <p>
        A single data source, specifically relevant to the question, that you judge relatively
        complete and reliable. The method requires only minor assumptions.
      </p>
    ),
  },
  {
    tier: 2,
    uf: "≥ 2",
    color: "var(--concentrating)",
    body: (
      <p>
        A combination of data sources you individually judge reliable. None is specifically
        relevant, but pieced together you judge them relatively complete. The method is
        relatively reliable, with well justified assumptions.
      </p>
    ),
  },
  {
    tier: 3,
    uf: "≥ 3",
    color: "var(--accent)",
    body: (
      <p>
        A combination of data sources, one or more of which you judge to be of uncertain
        reliability or completeness — or the method requires major assumptions or extrapolations.
      </p>
    ),
  },
  {
    tier: 4,
    uf: "—",
    body: (
      <p>
        You judge the data insufficient, or not possible to combine in such a way as to support an
        estimate. A valid finding in its own right: current evidence cannot support even an
        order-of-magnitude claim.
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
        title="Methodological tiers and uncertainty factors"
        accent="var(--accent-text)"
        maxWidth="640px"
      >
        <p className="font-body text-[14px] leading-[1.55] text-ink-soft mb-2">
          Uncertainty in an estimate comes from both the data — how reliable, how complete — and
          the method — what it assumes, and how it extends or combines data. The paper grades each
          estimate into one of four tiers capturing both.
        </p>
        <p className="font-body text-[14px] leading-[1.55] text-ink-soft mb-4">
          Each tier carries an{" "}
          <span className="italic text-ink">uncertainty factor (uf)</span>, the same judgement
          expressed as a multiplier: for an estimate of 100 incidents, uf = 2 implies the true
          number lies between 50 and 200, uf = 3 implies 33–300, and uf = 1 implies the estimate
          is precisely accurate. As a rough rule of thumb, the tier of an estimate approximates
          its uncertainty factor — tier 1 → uf ≥ 1; tier 2 → uf ≥ 2; tier 3 → uf ≥ 3.
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
                <div className="grid grid-cols-[24px_1fr_auto] gap-x-3 items-start">
                  <span className="font-display font-bold text-[19px] leading-none text-accent-text mt-0.5">
                    {row.tier}
                  </span>
                  <div>
                    <div className="font-body text-[14px] leading-snug text-ink">{row.body}</div>
                    {isCurrent && (
                      <div className="font-display italic text-[13px] text-accent-text mt-1">
                        — this estimate
                      </div>
                    )}
                  </div>
                  <span
                    className={`font-display italic text-[13px] px-2 py-0.5 border whitespace-nowrap ${row.color ? "" : "border-rule text-ink-faint"}`}
                    style={
                      row.color ? { borderColor: row.color, color: row.color } : undefined
                    }
                  >
                    {row.color ? `uf ${row.uf}` : "—"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 border-l-2 pl-3" style={{ borderColor: "var(--accent-text)" }}>
          <p className="font-body text-[13px] leading-[1.5] text-ink-soft">
            <span className="font-display italic text-accent-text">Straddling tiers</span> —
            estimates can sit between tiers: a 1-to-2 estimate is more reliable than tier 2 but
            not quite tier 1. Adjust the uncertainty factor accordingly and use your best
            judgement. Interpolation — reading between known data points — is generally more
            reliable than extrapolation — extending beyond the range the data actually covers.
          </p>
        </div>
      </Modal>
    </>
  );
}

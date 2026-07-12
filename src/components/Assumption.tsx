"use client";

import { useState, type ReactNode } from "react";

// A margin note in the editor's hand: thin rule, italic lead-in, no box.
// `label` accepts a node so tier mentions can carry a TierLink trigger.
// Below md the body collapses behind a show/hide toggle (the label stays)
// so long steps fit the ~60vh text zone; at md+ it is always visible.
export function Assumption({
  label = "Assumption",
  children,
}: {
  label?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="my-4 md:my-5 border-l-2 border-accent-soft pl-4 py-1">
      <div className="font-display italic text-[15px] md:text-[16px] text-accent-text mb-1 flex items-baseline justify-between gap-3">
        <span>{label}.</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="md:hidden shrink-0 font-display italic text-[13px] text-accent-text"
        >
          {open ? "hide −" : "show +"}
        </button>
      </div>
      <div
        className={
          "font-body text-[14px] md:text-[15px] leading-[1.55] text-ink-soft" +
          (open ? "" : " max-md:hidden")
        }
      >
        {children}
      </div>
    </aside>
  );
}

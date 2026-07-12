"use client";

import { useState, type ReactNode } from "react";

// Below md, secondary step material (example lists, asides) collapses behind
// an italic toggle so long steps fit the ~60vh text zone under the pinned
// viz; at md+ the toggle disappears and the content is always visible.
export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="md:hidden font-display italic text-[14px] text-accent-text"
      >
        {open ? "−" : "+"} {label}
      </button>
      <div className={open ? "max-md:mt-1.5" : "max-md:hidden"}>{children}</div>
    </div>
  );
}

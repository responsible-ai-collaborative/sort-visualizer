import type { ReactNode } from "react";

// A margin note in the editor's hand: thin rule, italic lead-in, no box.
export function Assumption({
  label = "Assumption",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-5 border-l-2 border-accent-soft pl-4 py-1">
      <div className="font-display italic text-[16px] text-accent-text mb-1">{label}.</div>
      <div className="font-body text-[15px] leading-[1.55] text-ink-soft">{children}</div>
    </aside>
  );
}

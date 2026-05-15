import type { ReactNode } from "react";

export function Assumption({
  label = "Assumption",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside
      className="my-5 border-l-2 border-accent-soft pl-4 py-2"
      style={{ background: "rgba(184, 92, 74, 0.05)" }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-soft mb-1.5">
        {label}
      </div>
      <div
        className="font-body italic text-[15px] leading-[1.55] text-ink-soft"
      >
        {children}
      </div>
    </aside>
  );
}

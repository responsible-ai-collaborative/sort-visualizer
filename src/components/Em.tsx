import type { ReactNode } from "react";

export function Em({ children }: { children: ReactNode }) {
  return (
    <em
      className="font-body italic text-accent"
    >
      {children}
    </em>
  );
}

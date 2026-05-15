import type { ReactNode } from "react";
import { StepNumber } from "@/components/StepNumber";

export function StepText({
  number,
  heading,
  children,
}: {
  number: string;
  heading?: string;
  children: ReactNode;
}) {
  return (
    <article className="max-w-[44ch]" role="region" aria-label={`Step ${number}`}>
      <StepNumber n={number} />
      {heading ? (
        <h2
          className="font-display text-[34px] md:text-[40px] leading-[1.08] tracking-[-0.012em] mb-5 text-ink"
        >
          {heading}
        </h2>
      ) : null}
      <div className="font-body text-[18px] leading-[1.62] text-ink-soft space-y-4">
        {children}
      </div>
    </article>
  );
}

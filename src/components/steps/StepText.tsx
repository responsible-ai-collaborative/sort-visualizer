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
    <article className="max-w-[46ch]" role="region" aria-label={`Step ${number}`}>
      <StepNumber n={number} />
      {heading ? (
        <h2 className="font-display font-medium text-[27px] md:text-[38px] leading-[1.12] tracking-[-0.008em] mb-4 md:mb-5 text-ink">
          {heading}
        </h2>
      ) : null}
      <div className="font-body text-[16px] md:text-[18px] leading-[1.62] text-ink-soft space-y-3 md:space-y-4">
        {children}
      </div>
    </article>
  );
}

"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { useScrollama } from "@/lib/useScrollama";

export type StepDef = {
  id: string;
  element: ReactNode;
};

export function ScrollySection({
  steps,
  Viz,
  sectionId,
  ariaLabel,
  vizAriaLabel,
}: {
  steps: StepDef[];
  Viz: ComponentType<{ activeStep: string | null }>;
  sectionId: string;
  ariaLabel: string;
  vizAriaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStep = useScrollama(containerRef, "[data-step]");

  return (
    <section
      id={sectionId}
      aria-label={ariaLabel}
      ref={containerRef}
      className="relative mx-auto max-w-[1240px] px-6 sm:px-8 mt-24 mb-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16">
        <div className="relative">
          {steps.map((step) => (
            <div
              key={step.id}
              data-step={step.id}
              className="min-h-[80vh] md:min-h-[95vh] flex flex-col justify-center py-12"
            >
              {step.element}
            </div>
          ))}
        </div>
        <div className="relative">
          <div
            className="sticky top-0 h-[70vh] md:h-screen flex items-center justify-center"
            aria-label={vizAriaLabel}
            role="img"
          >
            <Viz activeStep={activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { useScrollama } from "@/lib/useScrollama";
import type { StageId } from "@/lib/stages";

export type StepDef = {
  id: string;
  element: ReactNode;
};

export type CardSpec = {
  stageId: StageId;
};

// Top-of-viewport space reserved for the sticky ProgressStepper, so the
// in-card viz doesn't slide under it.
const STEPPER_HEIGHT = "52px";

export function ScrollySection({
  steps,
  Viz,
  sectionId,
  ariaLabel,
  vizAriaLabel,
  card,
}: {
  steps: StepDef[];
  Viz: ComponentType<{ activeStep: string | null }>;
  sectionId: string;
  ariaLabel: string;
  vizAriaLabel: string;
  card?: CardSpec;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStep = useScrollama(containerRef, "[data-step]");

  const grid = (
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
          className={
            card
              ? "sticky flex items-center justify-center"
              : "sticky top-0 h-[70vh] md:h-screen flex items-center justify-center"
          }
          style={
            card
              ? {
                  top: STEPPER_HEIGHT,
                  height: `calc(100vh - ${STEPPER_HEIGHT})`,
                }
              : undefined
          }
          aria-label={vizAriaLabel}
          role="img"
        >
          <Viz activeStep={activeStep} />
        </div>
      </div>
    </div>
  );

  if (card) {
    return (
      <section
        id={sectionId}
        aria-label={ariaLabel}
        ref={containerRef}
        className="relative mx-auto max-w-[1240px] px-6 sm:px-8 mt-8 mb-12"
      >
        <div
          data-card-frame={card.stageId}
          className="relative border border-rule bg-[rgba(255,255,255,0.5)] px-6 md:px-10 py-4"
        >
          {grid}
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      aria-label={ariaLabel}
      ref={containerRef}
      className="relative mx-auto max-w-[1240px] px-6 sm:px-8 mt-24 mb-32"
    >
      {grid}
    </section>
  );
}

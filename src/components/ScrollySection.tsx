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

// Paper-style figure caption rendered beneath the sticky viz.
export type FigureSpec = {
  n: number;
  caption: string;
};

// Card-section viz pins are offset by the ProgressStepper's 52px height so
// the viz doesn't slide under it (the 52px appears in the sticky classes
// below). On small screens every viz pins to the top 40vh of the viewport
// and the step text scrolls beneath it — [data-step] snaps to `end` below
// md (globals.css) so text rests in the remaining ~60vh.

export function ScrollySection({
  steps,
  Viz,
  sectionId,
  ariaLabel,
  vizAriaLabel,
  card,
  figure,
}: {
  steps: StepDef[];
  Viz: ComponentType<{ activeStep: string | null }>;
  sectionId: string;
  ariaLabel: string;
  vizAriaLabel: string;
  card?: CardSpec;
  figure?: FigureSpec;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStep = useScrollama(containerRef, "[data-step]");

  // Below md the viz overflows its 42vh pin for the tallest panels; the
  // overflow-y-auto + m-auto pair lets it scroll internally without the
  // usual center-clipping (auto margins resolve to 0 once content overflows).
  const mobilePin =
    "max-md:z-10 max-md:overflow-y-auto max-md:bg-bg max-md:border-b max-md:border-rule ";

  // Below md both grid children share cell (1,1): the viz column then spans
  // the full steps height (grid stretch), which is what lets its sticky pin
  // stay put for the whole section — as its own row it would be only as tall
  // as the viz and never stick. Steps take pt-[40vh] so they start below the
  // pin; the viz paints on top (later DOM order + z-10).
  const grid = (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-6 md:gap-16">
      <div className="relative max-md:col-start-1 max-md:row-start-1 max-md:pt-[40vh]">
        {steps.map((step) => (
          <div
            key={step.id}
            data-step={step.id}
            // Tight viewports (≤700px tall) can't hold a step's text centered
            // without clipping, so top-align it there — combined with snap
            // disabled (globals.css), the heading anchors up top and any
            // overflow scrolls into view instead of being cut off.
            className="min-h-[60vh] md:min-h-[95vh] flex flex-col justify-center tight:justify-start py-6 md:py-12"
          >
            {step.element}
          </div>
        ))}
      </div>
      <div className="relative max-md:col-start-1 max-md:row-start-1">
        <div
          className={
            mobilePin +
            // Tight viewports: the pinned viz can exceed its (100vh-based) box
            // and would otherwise center-and-clip, so let it scroll internally
            // — same escape hatch as the mobile pin (overflow-y-auto + the
            // figure's m-auto keep it from clipping the top).
            "tight:overflow-y-auto " +
            (card
              ? // The stepper is shorter below md (number chips), so the pin
                // offset shrinks with it — keep in sync with ProgressStepper.
                "sticky flex items-center justify-center top-[38px] h-[calc(40vh-38px)] md:top-[52px] md:h-[calc(100vh-52px)]"
              : "sticky flex items-center justify-center top-0 h-[40vh] md:h-screen")
          }
          aria-label={vizAriaLabel}
          role="img"
        >
          <figure className="flex flex-col items-center gap-3 w-full m-auto">
            <Viz activeStep={activeStep} />
            {figure ? (
              <figcaption className="max-md:hidden max-w-[52ch] text-center font-body text-[13px] leading-snug text-ink-faint px-4 transition-opacity duration-300">
                <span className="font-display italic text-accent-text">Fig. {figure.n}</span>
                {" — "}
                {figure.caption}
              </figcaption>
            ) : null}
          </figure>
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

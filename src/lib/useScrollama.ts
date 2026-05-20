"use client";

import { useEffect, useRef, useState } from "react";

type StepEntry = {
  index: number;
  element: HTMLElement;
  direction: "up" | "down";
};

type ScrollamaInstance = {
  setup: (opts: {
    step: string | HTMLElement[] | NodeList;
    offset?: number;
    progress?: boolean;
    debug?: boolean;
  }) => ScrollamaInstance;
  onStepEnter: (cb: (response: StepEntry) => void) => ScrollamaInstance;
  onStepExit: (cb: (response: StepEntry) => void) => ScrollamaInstance;
  resize: () => void;
  destroy: () => void;
};

export function useScrollama(
  containerRef: React.RefObject<HTMLElement | null>,
  stepSelector: string,
) {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const scrollerRef = useRef<ScrollamaInstance | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let resizeHandler: (() => void) | null = null;

    (async () => {
      const mod = (await import("scrollama")) as unknown as {
        default: () => ScrollamaInstance;
      };
      if (cancelled) return;

      const factory = mod.default ?? (mod as unknown as () => ScrollamaInstance);
      const scroller = factory();
      scrollerRef.current = scroller;

      const steps = Array.from(container.querySelectorAll<HTMLElement>(stepSelector));
      const lastIndex = steps.length - 1;

      scroller
        .setup({ step: steps, offset: 0.5, progress: false })
        .onStepEnter(({ element }) => {
          const id = element.dataset.step ?? null;
          setActiveStep(id);
        })
        .onStepExit(({ element, direction, index }) => {
          // Clear when leaving the section on either end: scrolling up past the
          // first step OR down past the last step. The latter is what lets the
          // page-level pipeline-phase fall through to whatever section the
          // reader has just entered.
          const isFirstUp = direction === "up" && index === 0;
          const isLastDown = direction === "down" && index === lastIndex;
          if (isFirstUp || isLastDown) {
            const id = element.dataset.step ?? null;
            setActiveStep((current) => (current === id ? null : current));
          }
        });

      resizeHandler = () => scroller.resize();
      window.addEventListener("resize", resizeHandler);
    })();

    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      scrollerRef.current?.destroy();
      scrollerRef.current = null;
    };
  }, [containerRef, stepSelector]);

  return activeStep;
}

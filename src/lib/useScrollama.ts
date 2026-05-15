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

      scroller
        .setup({ step: steps, offset: 0.5, progress: false })
        .onStepEnter(({ element }) => {
          const id = element.dataset.step ?? null;
          setActiveStep(id);
        })
        .onStepExit(({ element, direction, index }) => {
          // When scrolling up past the first step, clear the active state so
          // the viz returns to its initial (empty) snapshot.
          if (direction === "up" && index === 0) {
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

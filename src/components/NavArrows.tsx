"use client";

import { useEffect, useState, useCallback } from "react";

// Faint top/bottom arrows that step through the [data-step] beats. Visible
// only after the reader has begun scrolling; auto-disabled at the boundaries.
// Snapping is handled by CSS scroll-snap-type: mandatory on <html>, so all
// the arrows have to do is pick the right element and call scrollIntoView —
// the browser then snaps to it cleanly.

export function NavArrows() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    if (steps.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStepCount(steps.length);

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = steps.indexOf(entry.target as HTMLElement);
          if (idx < 0) return;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        });
        if (best) setActiveIndex((best as { idx: number }).idx);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.5, 1] },
    );
    steps.forEach((s) => observer.observe(s));

    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToIndex = useCallback((idx: number) => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    const target = steps[idx];
    if (target) target.scrollIntoView({ block: "center" });
  }, []);

  const goPrev = useCallback(() => {
    if (activeIndex === null) {
      scrollToIndex(0);
      return;
    }
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
    else window.scrollTo({ top: 0 });
  }, [activeIndex, scrollToIndex]);

  const goNext = useCallback(() => {
    if (activeIndex === null) {
      scrollToIndex(0);
      return;
    }
    if (activeIndex < stepCount - 1) scrollToIndex(activeIndex + 1);
    else window.scrollTo({ top: document.documentElement.scrollHeight });
  }, [activeIndex, stepCount, scrollToIndex]);

  const atTop = activeIndex === null || activeIndex === 0;
  const atBottom = activeIndex !== null && activeIndex >= stepCount - 1;

  if (!mounted) return null;

  return (
    <>
      <NavButton
        direction="up"
        onClick={goPrev}
        hidden={!showTop || atTop}
        ariaLabel="Previous step"
      />
      <NavButton direction="down" onClick={goNext} hidden={atBottom} ariaLabel="Next step" />
    </>
  );
}

function NavButton({
  direction,
  onClick,
  hidden,
  ariaLabel,
}: {
  direction: "up" | "down";
  onClick: () => void;
  hidden: boolean;
  ariaLabel: string;
}) {
  const isUp = direction === "up";
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        "fixed left-1/2 -translate-x-1/2 z-30",
        "h-11 w-11 flex items-center justify-center",
        "rounded-full transition-opacity duration-300",
        isUp ? "top-4" : "bottom-6",
        hidden ? "opacity-0 pointer-events-none" : "opacity-35 hover:opacity-90",
      ].join(" ")}
      style={{ color: "var(--ink-soft)" }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {isUp ? (
          <>
            <path d="M11 17 V5" />
            <path d="M5 11 L11 5 L17 11" />
          </>
        ) : (
          <>
            <path d="M11 5 V17" />
            <path d="M5 11 L11 17 L17 11" />
          </>
        )}
      </svg>
    </button>
  );
}

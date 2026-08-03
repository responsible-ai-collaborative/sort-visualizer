"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { collectSlides, slideOffsets, scrollToSlide, type Slide } from "@/lib/slide-nav";

// Faint top/bottom arrows that step through every snap beat — header,
// [data-step] slides, closing — one slide per click. ArrowUp/ArrowDown do
// the same (mandatory snap otherwise swallows small keyboard scrolls).
// Snapping is handled by CSS scroll-snap-type: mandatory on <html> and the
// glide by scroll-behavior: smooth, so all the arrows do is pick the right
// element and scroll to it — the browser settles the landing.

export function NavArrows() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const slidesRef = useRef<Slide[]>([]);
  // Cached like ProgressRail: measuring every slide's rect per scroll frame
  // was needless layout work. Re-measured only on resize/font-load.
  const offsetsRef = useRef<number[]>([]);
  const ticking = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // Desktop-only widget (arrows hidden below md); skip scroll work on phones.
    const desktop = window.matchMedia("(min-width: 768px)");

    const measure = () => {
      slidesRef.current = collectSlides();
      offsetsRef.current = slideOffsets(slidesRef.current);
      setSlideCount(slidesRef.current.length);
    };

    // Nearest slide to the current scroll, from cached offsets. setActiveIndex
    // bails out when the value is unchanged, so this is cheap mid-slide.
    const update = () => {
      const offsets = offsetsRef.current;
      if (offsets.length === 0) return;
      const y = window.scrollY;
      let best = 0;
      for (let i = 1; i < offsets.length; i++) {
        if (Math.abs(y - offsets[i]) < Math.abs(y - offsets[best])) best = i;
      }
      setActiveIndex(best);
    };

    const schedule = () => {
      if (!desktop.matches || ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        update();
      });
    };

    const remeasure = () => {
      measure();
      update();
    };

    requestAnimationFrame(remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) scrollToSlide(slidesRef.current, activeIndex - 1);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    if (activeIndex < slidesRef.current.length - 1)
      scrollToSlide(slidesRef.current, activeIndex + 1);
  }, [activeIndex]);

  // Arrow keys page through slides too — skipped when a form control or
  // editable element has focus so native key handling still works there.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (
        target &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="slider"], [role="listbox"]'))
      )
        return;
      e.preventDefault();
      if (e.key === "ArrowUp") goPrev();
      else goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const atTop = activeIndex === 0;
  const atBottom = slideCount > 0 && activeIndex >= slideCount - 1;

  if (!mounted) return null;

  return (
    <>
      <NavButton direction="up" onClick={goPrev} hidden={atTop} ariaLabel="Previous slide" />
      <NavButton direction="down" onClick={goNext} hidden={atBottom} ariaLabel="Next slide" />
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
      data-nav-arrow={direction}
      className={[
        // md+ only — on mobile the arrows just crowd the small screen, and
        // thumb-scrolling with snap already pages one slide at a time.
        // Center on the ProgressRail track (nav at left-4, 3px wide → center
        // ~17.5px) so the arrows sit directly in line with the rail: the up
        // arrow caps its top and the down arrow its bottom, reading as one
        // navigation cluster.
        "max-md:hidden fixed left-[17.5px] -translate-x-1/2 z-30",
        "h-11 w-11 flex items-center justify-center",
        "rounded-full transition-[opacity,top] duration-300",
        isUp ? "top-[8vh]" : "bottom-[8vh]",
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

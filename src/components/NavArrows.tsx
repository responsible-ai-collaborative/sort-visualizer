"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { collectSlides, nearestSlideIndex, scrollToSlide, type Slide } from "@/lib/slide-nav";

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
  const ticking = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      if (slidesRef.current.length === 0) return;
      setActiveIndex(nearestSlideIndex(slidesRef.current));
    };

    const schedule = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        update();
      });
    };

    // Collect after layout settles, same as ProgressRail; offsets are
    // re-measured on every update so only the slide list is cached.
    requestAnimationFrame(() => {
      slidesRef.current = collectSlides();
      setSlideCount(slidesRef.current.length);
      update();
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
        "max-md:hidden fixed left-1/2 -translate-x-1/2 z-30",
        "h-11 w-11 flex items-center justify-center",
        "rounded-full transition-[opacity,top] duration-300",
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

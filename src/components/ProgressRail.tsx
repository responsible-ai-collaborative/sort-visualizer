"use client";

import { useEffect, useRef, useState } from "react";
import { collectSlides, slideOffsets, scrollToSlide, type Slide } from "@/lib/slide-nav";

// Vertical reading-progress rail fixed to the left edge (md+ only). One
// segment per snap beat (header, every [data-step], closing); segments fill
// top-down with navy as the reader advances, the partially-filled segment
// being the current slide. Hovering (or focusing) a segment reveals its
// heading in a small chip and clicking jumps to it — mandatory snap on
// <html> then settles the landing, same as NavArrows.

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function ProgressRail() {
  const [slides, setSlides] = useState<Slide[]>([]);
  // Fractional position along the slides: 0 = resting on the first, N-1 = on
  // the last. Segment i's fill is clamp(t - i + 1, 0, 1), so the current
  // slide's segment fills as you approach its rest position.
  const [t, setT] = useState(0);
  const ticking = useRef(false);
  const slidesRef = useRef<Slide[]>([]);
  // Offsets are cached and re-measured only on resize/font-load — never per
  // scroll frame. getBoundingClientRect on every slide each frame was forcing
  // ~22 synchronous layouts per frame and stuttered the scroll.
  const offsetsRef = useRef<number[]>([]);

  useEffect(() => {
    // Desktop-only widget (hidden below md); don't burn scroll frames measuring
    // and re-rendering an invisible rail on phones.
    const desktop = window.matchMedia("(min-width: 768px)");

    const measure = () => {
      slidesRef.current = collectSlides();
      offsetsRef.current = slideOffsets(slidesRef.current);
      setSlides(slidesRef.current);
    };

    const update = () => {
      const offsets = offsetsRef.current;
      if (offsets.length < 2) return;
      const y = window.scrollY;
      let next = offsets.length - 1;
      for (let i = 0; i < offsets.length - 1; i++) {
        if (y < offsets[i + 1]) {
          const span = Math.max(1, offsets[i + 1] - offsets[i]);
          next = i + clamp((y - offsets[i]) / span, 0, 1);
          break;
        }
      }
      setT(next);
    };

    const schedule = () => {
      if (!desktop.matches || ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        update();
      });
    };

    // Re-measure (not just update) when layout can actually shift.
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

  if (slides.length < 2) return null;

  const jumpTo = (i: number) => scrollToSlide(slides, i);

  return (
    <nav
      aria-label="Reading progress"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col h-[68vh] w-[3px] gap-[3px]"
    >
      {slides.map((slide, i) => {
        const fill = clamp(t - i + 1, 0, 1);
        return (
          <button
            key={i}
            type="button"
            onClick={() => jumpTo(i)}
            aria-label={`Jump to ${slide.label}`}
            aria-current={i === Math.round(t) ? "true" : undefined}
            className="group relative flex-1 cursor-pointer outline-none"
          >
            {/* generous hit area around the 3px track */}
            <span aria-hidden className="absolute -inset-x-2.5 inset-y-0" />
            <span
              aria-hidden
              className="absolute inset-0 transition-colors duration-150 bg-rule group-hover:bg-accent-soft group-focus-visible:bg-accent-soft"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 bg-accent"
              style={{ height: `${(fill * 100).toFixed(1)}%` }}
            />
            {/* heading chip, tooltip voice — italic display face, hairline box */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap max-w-[260px] overflow-hidden text-ellipsis border border-rule bg-white px-2.5 py-1 text-left font-display italic text-[13px] leading-snug text-ink-soft shadow-[0_2px_10px_rgba(1,25,52,0.10)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {slide.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

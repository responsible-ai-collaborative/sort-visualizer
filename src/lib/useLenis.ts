"use client";

import { useEffect } from "react";

// Enables Lenis smooth-scroll at the document level. Lenis intercepts the
// wheel/trackpad and animates document scroll, which makes scrolling feel
// more deliberate. It plays politely with CSS scroll-snap: the browser snap
// engine still kicks in at scroll-end. With `mandatory` snap on tall
// targets you may notice a slight tug-of-war on aggressive flicks — drop
// to `proximity` in the TuningPanel if that bothers you.

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let rafId = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

    (async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const tick = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    })();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [enabled]);
}

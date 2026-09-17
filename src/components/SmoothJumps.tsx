"use client";

// Intercepts in-page anchor jumps (the ProgressStepper tabs, the Header's
// "what's ahead" cards) so they scroll with mandatory snap briefly lifted.
// Otherwise `scroll-snap-stop: always` (globals.css) halts the jump at the
// first snap point it passes — so jumping to a later section stalls on an
// intermediate step instead of landing there. After the scroll settles, snap
// re-engages and centers the nearest step.

import { useEffect } from "react";
import { withSnapDisabled } from "@/lib/slide-nav";

export function SmoothJumps() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      // Click-time landing offset doubles as the arrival check for
      // withSnapDisabled (see slide-nav) — a mid-glide main-thread stall must
      // not re-engage snap while the glide is merely paused.
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const landing = Math.min(maxScroll, Math.max(0, el.getBoundingClientRect().top + window.scrollY));
      withSnapDisabled(
        () => el.scrollIntoView({ block: "start" }),
        () => Math.abs(window.scrollY - landing) < 4,
      );
      history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

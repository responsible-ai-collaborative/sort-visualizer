// Shared slide-list helpers for the page-level navigation widgets
// (ProgressRail, NavArrows). One "slide" per snap beat, in page order: the
// header landmark, every [data-step], the closing landmark. Offsets are
// re-measured on demand (fonts/layout can shift them); only the element
// list itself is worth caching.

export type Slide = { el: HTMLElement; label: string };

export function collectSlides(): Slide[] {
  const slides: Slide[] = [];
  const header = document.querySelector<HTMLElement>('[data-snap-landmark="start"]');
  if (header) slides.push({ el: header, label: "Introduction" });
  document.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
    const heading = el.querySelector("h2")?.textContent?.trim();
    const region = el.querySelector("article")?.getAttribute("aria-label") ?? "";
    slides.push({ el, label: heading || region || "Untitled step" });
  });
  const closing = document.querySelector<HTMLElement>('[data-snap-landmark="end"]');
  if (closing) slides.push({ el: closing, label: "Closing" });
  return slides;
}

// Snap-rest scroll offset for a slide (steps snap to center). The header and
// closing are start/end aligned, so their center-based estimate can be off by
// half a landmark — clamping to the real scroll range pins them to the true
// top/bottom rest positions.
export function slideOffset(slide: Slide): number {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const r = slide.el.getBoundingClientRect();
  const center = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
  return Math.min(maxScroll, Math.max(0, center));
}

export function slideOffsets(slides: readonly Slide[]): number[] {
  return slides.map(slideOffset);
}

// Run a programmatic scroll with mandatory snap temporarily lifted, then
// restore it once the glide has truly arrived. Without the lift,
// `scroll-snap-stop: always` (globals.css) halts any multi-beat jump at the
// first snap point it passes — so the lift must survive the WHOLE glide. Two
// earlier restore schemes both re-engaged snap mid-flight and stranded the
// jump on an early beat: a fixed 1s timeout (long glides outlive it), then a
// scroll-event debounce (the first cold pass into act-2 — stepper's first
// paint, scrollama activations, framer re-renders — stalls the main thread
// past the debounce, and the timer fired while the animation was merely
// paused). Restore is now gated on the glide actually finishing: scrolling
// must have gone quiet AND either the target offset was reached or `scrollend`
// says the scroll definitively ended. A quiet moment mid-glide re-arms and
// keeps the lift. A 5s guard (reset by every scroll event) is the escape hatch
// for a scroll that never ends and never reports. A newer jump takes over
// cleanly: its predecessor's pending restore is cancelled so it can't fire
// under the new glide's feet.
let cancelPending: (() => void) | null = null;

export function withSnapDisabled(run: () => void, reachedTarget?: () => boolean): void {
  const root = document.documentElement;
  cancelPending?.();
  root.style.scrollSnapType = "none";
  run();

  let done = false;
  let sawEnd = false;
  let quietTimer: number | undefined;
  let guardTimer: number | undefined;

  function finish(): void {
    if (done) return;
    done = true;
    window.clearTimeout(quietTimer);
    window.clearTimeout(guardTimer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", onScrollEnd);
    if (cancelPending === cancel) {
      cancelPending = null;
      root.style.scrollSnapType = "";
    }
  }

  function cancel(): void {
    if (done) return;
    done = true;
    window.clearTimeout(quietTimer);
    window.clearTimeout(guardTimer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", onScrollEnd);
    if (cancelPending === cancel) cancelPending = null;
  }

  function onQuiet(): void {
    if (done) return;
    // scrollend seen (true end or a cancelled glide) or the landing matches
    // the click-time target → the glide is over, lift the hold. Otherwise the
    // scroll merely paused (first-pass paint stall) — keep the lift armed and
    // try again on the next quiet window.
    if (sawEnd || !reachedTarget || reachedTarget()) {
      finish();
      return;
    }
    quietTimer = window.setTimeout(onQuiet, 250);
  }

  function onScroll(): void {
    if (done) return;
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(onQuiet, 250);
    window.clearTimeout(guardTimer);
    guardTimer = window.setTimeout(finish, 5000);
  }

  function onScrollEnd(): void {
    if (done) return;
    sawEnd = true;
    onQuiet();
  }

  // Arm up front: a no-op jump (target == current position) fires no scroll
  // events at all, and onQuiet's target check passes immediately there.
  onQuiet();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", onScrollEnd);
  guardTimer = window.setTimeout(finish, 5000);
  cancelPending = cancel;
}

// Scroll a slide to its snap-rest position; mandatory snap on <html> settles
// the landing. Smoothness comes from `scroll-behavior: smooth` on <html>
// (globals.css), which the reduced-motion override switches back to auto. The
// click-time offset doubles as the arrival check for withSnapDisabled — a
// mid-glide stall (restored too eagerly, the jump strands on an early beat)
// can no longer fool it.
export function scrollToSlide(slides: readonly Slide[], index: number): void {
  const slide = slides[index];
  if (!slide) return;
  if (index === 0) {
    withSnapDisabled(() => window.scrollTo({ top: 0 }), () => window.scrollY <= 1);
    return;
  }
  if (index === slides.length - 1) {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    withSnapDisabled(
      () => window.scrollTo({ top: document.documentElement.scrollHeight }),
      () => window.scrollY >= max - 1,
    );
    return;
  }
  const target = slideOffset(slide);
  withSnapDisabled(
    () => slide.el.scrollIntoView({ block: "center" }),
    () => Math.abs(window.scrollY - target) < 4,
  );
}

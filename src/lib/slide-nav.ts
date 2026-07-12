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

// Approximate snap-rest scroll offset for a slide (steps snap to center).
// The header and closing are start/end aligned, so their center-based
// estimate can be off by half a landmark — clamping to the real scroll
// range pins them to the true top/bottom rest positions.
export function slideOffsets(slides: readonly Slide[]): number[] {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return slides.map((s) => {
    const r = s.el.getBoundingClientRect();
    const center = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
    return Math.min(maxScroll, Math.max(0, center));
  });
}

// Index of the slide whose snap-rest offset is closest to the current scroll
// position — i.e. the slide the reader is on (or nearest to, mid-flight).
export function nearestSlideIndex(slides: readonly Slide[]): number {
  if (slides.length === 0) return 0;
  const y = window.scrollY;
  const offsets = slideOffsets(slides);
  let best = 0;
  offsets.forEach((offset, i) => {
    if (Math.abs(y - offset) < Math.abs(y - offsets[best])) best = i;
  });
  return best;
}

// Scroll a slide to its snap-rest position; mandatory snap on <html> settles
// the landing. Smoothness comes from `scroll-behavior: smooth` on <html>
// (globals.css), which the reduced-motion override switches back to auto.
export function scrollToSlide(slides: readonly Slide[], index: number): void {
  const slide = slides[index];
  if (!slide) return;
  if (index === 0) window.scrollTo({ top: 0 });
  else if (index === slides.length - 1)
    window.scrollTo({ top: document.documentElement.scrollHeight });
  else slide.el.scrollIntoView({ block: "center" });
}

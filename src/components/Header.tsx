import { STAGES, type StageId } from "@/lib/stages";
import { CreditsButton } from "@/components/CreditsButton";

// One-line preview of each stage for the "what's ahead" cards; the card
// itself links to the stage's first section (same targets as the stepper).
const STAGE_BLURBS: Record<StageId, string> = {
  mq: "Frame one precise, comparable question with the SORT structure.",
  estimation: "Estimate harm and exposure — independently, across two periods.",
  classification: "Read the trajectory on a 2 × 2 grid, uncertainty and all.",
};

// Companion resources shown beside "Read the paper". `external` links open in a
// new tab; omit `href` to render a placeholder box until the destination exists.
const RESOURCES: { label: string; href?: string; external?: boolean }[] = [
  {
    label: "Monitoring question",
    href: "https://claude.ai/public/artifacts/9ec3813a-399c-48ea-96ed-19443d121b83",
    external: true,
  },
  { label: "Estimation guide" },
  { label: "Classification tool", href: "/classifier" },
];

// Shared box styling. On mobile the boxes are a two-up grid that only collapses
// to one column when a box can't fit two-wide (basis 50% minus half the gap,
// grow to fill the row); from sm up they revert to natural inline widths so
// they pack side by side and wrap only as needed.
const BOX_CLASS =
  "inline-flex items-center justify-center text-center font-body text-[14px] md:text-[15px] " +
  "px-4 py-2 md:px-5 md:py-2.5 transition-colors " +
  "basis-[calc(50%-0.25rem)] grow sm:basis-auto sm:grow-0 sm:justify-start sm:text-left";

export function Header() {
  return (
    <header
      data-snap-landmark="start"
      // Keep this comfortably shorter than the viewport: when it outgrows the
      // screen, mandatory snap rests it bottom-aligned after a down/up cycle
      // but top-aligned on first load — the reader sees the top padding as a
      // stray gap that "goes away" after scrolling.
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[880px] px-6 sm:px-8 pt-16 pb-8 md:pt-16 md:pb-12 md:short:pt-10 md:short:pb-8"
    >
      <h1 className="font-display font-medium text-[34px] sm:text-[62px] md:short:text-[48px] leading-[1.06] tracking-[-0.012em] text-ink mb-5 md:mb-8 md:short:mb-5 max-w-[16ch]">
        AI incident reports are rising.
        <br />
        <span className="italic font-normal text-accent-text">What does that actually mean?</span>
      </h1>
      <p className="font-body text-[15px] sm:text-[19px] leading-[1.55] sm:leading-[1.6] text-ink-soft max-w-[640px]">
        Increasing numbers could reflect any combination of three factors: more AI being deployed,
        more reporting infrastructure picking up what was always there, or more harm per use. To
        address frontier-AI risks properly, we have to distinguish between them.
      </p>

      {/* What's ahead — three phases, so the reader knows the shape and length
          before scrolling. */}
      <div className="mt-6 md:mt-10 md:short:mt-6 max-w-[680px]">
        <div className="font-display italic text-[13px] md:text-[14px] text-ink-faint mb-2 md:mb-3">
          What&apos;s ahead — a three-stage walkthrough, about five minutes
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {STAGES.map((stage, i) => (
            <li key={stage.id}>
              <a
                href={`#${stage.sectionIds[0]}`}
                className="block h-full border border-rule bg-[rgba(255,255,255,0.5)] px-4 py-2 sm:py-3 transition-colors hover:border-accent/60 hover:bg-white focus-visible:border-accent"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[12px] text-accent-text">{i + 1}</span>
                  <span className="font-display italic text-[15px] text-ink">{stage.short}</span>
                  <span aria-hidden className="sm:hidden ml-auto text-ink-faint text-[13px]">
                    →
                  </span>
                </div>
                <p className="max-sm:hidden font-body text-[13px] leading-[1.45] text-ink-soft mt-1">
                  {STAGE_BLURBS[stage.id]}
                </p>
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* Primary CTA stands alone and filled; the three companion tools are a
          lighter outlined group beneath it, so the row isn't a wall of
          identical boxes. */}
      <div className="mt-6 md:mt-9 md:short:mt-6">
        <a
          href="https://arxiv.org/abs/2604.19914"
          target="_blank"
          rel="noopener noreferrer"
          className={
            "border border-accent bg-accent text-white hover:bg-accent-text hover:border-accent-text focus-visible:outline-none " +
            BOX_CLASS
          }
        >
          Read the paper ↗
        </a>
        <div className="mt-3 md:mt-4 flex flex-wrap items-stretch gap-2 sm:gap-3">
          {RESOURCES.map((r) => (
            // `href` is left undefined until a destination exists; the box
            // still renders identically, it just isn't clickable yet.
            <a
              key={r.label}
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={
                "border border-rule text-ink bg-transparent hover:border-accent/60 hover:bg-[rgba(255,255,255,0.6)] focus-visible:border-accent " +
                BOX_CLASS
              }
            >
              {r.label} {r.external ? "↗" : "→"}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-6 md:mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display italic text-[14px] md:text-[15px] text-ink-faint">
        <span>scroll to begin ↓</span>
        <span aria-hidden className="text-rule">
          ·
        </span>
        <CreditsButton className="underline decoration-ink-faint/40 hover:text-accent-text hover:decoration-accent-text transition-colors" />
      </div>
    </header>
  );
}

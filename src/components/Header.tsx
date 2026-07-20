import { STAGES, type StageId } from "@/lib/stages";

// One-line preview of each stage for the "what's ahead" cards; the card
// itself links to the stage's first section (same targets as the stepper).
const STAGE_BLURBS: Record<StageId, string> = {
  mq: "Frame one precise, comparable question with the SORT structure.",
  estimation: "Estimate harm and exposure — independently, across two periods.",
  classification: "Read the trajectory on a 2 × 2 grid, uncertainty and all.",
};

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
      <div className="font-display italic text-[14px] md:text-[17px] text-ink-faint mb-4 md:mb-7 md:short:mb-4">
        A walk through the SORT framework for AI incident monitoring
      </div>
      <h1 className="font-display font-medium text-[34px] sm:text-[62px] md:short:text-[48px] leading-[1.06] tracking-[-0.012em] text-ink mb-5 md:mb-8 md:short:mb-5 max-w-[16ch]">
        AI incident reports are climbing.{" "}
        <span className="italic font-normal text-accent-text">What does that actually mean?</span>
      </h1>
      <p className="font-body text-[15px] sm:text-[19px] leading-[1.55] sm:leading-[1.6] text-ink-soft max-w-[640px]">
        A rising line could reflect any combination of three forces — more AI being deployed, more
        reporting infrastructure picking up what was always there, or more harm per use. To address
        frontier-AI risks properly, the readings have to be separated. A new framework does exactly
        that — and reaches a verdict on AI chatbots and self-harm that the headlines would never
        suggest.
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
                <p className="max-sm:hidden md:short:hidden font-body text-[13px] leading-[1.45] text-ink-soft mt-1">
                  {STAGE_BLURBS[stage.id]}
                </p>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 md:mt-9 md:short:mt-6 flex items-baseline gap-6">
        <a
          href="https://arxiv.org/abs/2604.19914"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body text-[14px] md:text-[15px] px-4 py-2 md:px-5 md:py-2.5 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
        >
          Read the paper
        </a>
        <span className="font-display italic text-[14px] md:text-[15px] text-ink-faint">
          scroll to begin ↓
        </span>
      </div>
    </header>
  );
}

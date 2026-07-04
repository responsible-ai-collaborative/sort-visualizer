export function Header() {
  return (
    <header
      data-snap-landmark="start"
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[880px] px-6 sm:px-8 pt-28 pb-16"
    >
      <div className="font-display italic text-[17px] text-ink-faint mb-7 mt-10">
        A walk through the SORT framework for AI incident monitoring
      </div>
      <h1 className="font-display font-medium text-[46px] sm:text-[62px] leading-[1.06] tracking-[-0.012em] text-ink mb-8 max-w-[16ch]">
        AI incident reports are climbing.{" "}
        <span className="italic font-normal text-accent-text">What does that actually mean?</span>
      </h1>
      <p className="font-body text-[18px] sm:text-[19px] leading-[1.6] text-ink-soft max-w-[640px]">
        A rising line could reflect any combination of three forces — more AI being deployed, more
        reporting infrastructure picking up what was always there, or more harm per use. To address
        frontier-AI risks properly, the readings have to be separated. A new framework does exactly
        that — and reaches a verdict on AI chatbots and self-harm that the headlines would never
        suggest.
      </p>
      <div className="mt-9 flex items-baseline gap-6">
        <a
          href="/source_paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body text-[15px] px-5 py-2.5 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
        >
          Read the paper
        </a>
        <span className="font-display italic text-[15px] text-ink-faint">scroll to begin ↓</span>
      </div>
    </header>
  );
}

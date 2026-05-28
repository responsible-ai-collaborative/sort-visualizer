export function Header() {
  return (
    <header
      data-snap-landmark="center"
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[860px] px-6 sm:px-8 pt-28 pb-16 text-center"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint mb-6 mt-10">
        AI Incident Monitoring · A walk through the SORT framework
      </div>
      <h1 className="font-display text-[44px] sm:text-[58px] leading-[1.04] tracking-[-0.018em] text-ink mb-7">
        AI incident reports are climbing across the board.
        <br />
        <span className="italic text-accent-text">What does that actually mean?</span>
      </h1>
      <p className="font-body text-[18px] sm:text-[20px] leading-[1.55] text-ink-soft max-w-[720px] mx-auto">
        A rising line could reflect any combination of three forces — more AI
        being deployed, more reporting infrastructure picking up what was
        always there, or more harm per use. To address frontier-AI risks
        properly, the readings have to be separated. A new framework introduced
        in the paper does that — and in doing so produces opposite
        verdicts on two harms that look superficially similar.
      </p>
      <div className="mt-8">
        <a
          href="/source_paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-[11px] uppercase tracking-[0.16em] px-5 py-2.5 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
        >
          Read the full paper here
        </a>
      </div>
      <div className="mt-10 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        <span className="h-px w-10 bg-rule" aria-hidden />
        <span>Scroll or click to begin</span>
        <span className="h-px w-10 bg-rule" aria-hidden />
      </div>
    </header>
  );
}

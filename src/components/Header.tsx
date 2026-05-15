export function Header() {
  return (
    <header
      data-snap-landmark="center"
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[860px] px-6 sm:px-8 pt-28 pb-16 text-center"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint mb-6">
        AI Incident Monitoring · A walk through the SORT framework
      </div>
      <h1
        className="font-display text-[44px] sm:text-[58px] leading-[1.04] tracking-[-0.018em] text-ink mb-7"
      >
        AI incident reports are climbing.
        <br />
        <span className="italic text-accent">
          What does that actually mean?
        </span>
      </h1>
      <p
        className="font-body text-[18px] sm:text-[20px] leading-[1.5] text-ink-soft max-w-[720px] mx-auto"
      >
        Raw incident counts conflate three things: more deployed AI, more
        reporting infrastructure, and more harm per use. A new framework from
        Slattery et al. (2026) separates them — and in doing so produces
        opposite verdicts on two harms that look superficially similar.
      </p>
      <div className="mt-10 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        <span className="h-px w-10 bg-rule" aria-hidden />
        <span>Scroll to begin</span>
        <span className="h-px w-10 bg-rule" aria-hidden />
      </div>
    </header>
  );
}

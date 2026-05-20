import { Em } from "@/components/Em";

export function Closing() {
  return (
    <section
      data-snap-landmark="center"
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[760px] px-6 sm:px-8 py-28 text-center"
      aria-label="Closing"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint mb-6">
        What the framework reveals
      </div>
      <h2 className="font-display text-[30px] sm:text-[36px] leading-[1.15] tracking-[-0.01em] text-ink mb-6">
        Two harms moving the same direction on the raw counts, two opposite
        trajectories.
      </h2>
      <p className="font-body text-[17px] leading-[1.62] text-ink-soft mb-5">
        Conversational AI and self-harm gets <Em>escalating</Em>: both exposure
        and harm-per-exposure are rising. Autonomous-vehicle crashes get{" "}
        <Em>mitigating</Em>: exposure is rising faster than harm. The raw
        counts alone could not have told the difference between them.
      </p>
      <p className="font-body text-[17px] leading-[1.62] text-ink-soft">
        The point of the framework isn&apos;t to settle the verdict. It&apos;s
        to make the assumption stack visible — the bound construction, the
        proxy choices, the confidence tier — so that policy makers and
        practitioners can argue about the moves, not just the conclusion.
      </p>
      <div className="mt-12 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        Slattery et al. (2026) · Classification of AI incident trajectories
      </div>
    </section>
  );
}

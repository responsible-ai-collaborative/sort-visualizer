import { Em } from "@/components/Em";

export function PivotSection() {
  return (
    <section
      data-snap-landmark="center"
      className="w-full min-h-screen flex items-center py-28 my-12"
      style={{ background: "var(--bg-deep)" }}
      aria-label="Pivot to autonomous vehicles case study"
    >
      <div className="mx-auto max-w-[760px] px-6 sm:px-8 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint mb-5">
          Same framework · Different case · Different verdict
        </div>
        <h2
          className="font-display text-[34px] sm:text-[42px] leading-[1.1] tracking-[-0.012em] text-ink mb-5"
        >
          AV crashes are rising too. Why does the framework call them <Em>mitigating</Em>?
        </h2>
        <p
          className="font-body text-[17px] leading-[1.6] text-ink-soft"
        >
          The same procedure — define a monitoring question, estimate harm and
          exposure separately, classify — is now applied to a second case. The
          numbers come from NHTSA's mandatory reporting and the Autonomous
          Vehicle Industry Association. Watch where the dot lands.
        </p>
      </div>
    </section>
  );
}

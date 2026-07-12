import { Em } from "@/components/Em";

export function Closing() {
  return (
    <section
      data-snap-landmark="end"
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[720px] px-6 sm:px-8 py-12 md:py-28"
      aria-label="Closing"
    >
      <div className="font-display italic text-[14px] md:text-[17px] text-ink-faint mb-3 md:mb-6">
        What the framework reveals
      </div>
      <h2 className="font-display font-medium text-[25px] sm:text-[40px] leading-[1.14] tracking-[-0.008em] text-ink mb-4 md:mb-6">
        The headlines say chatbot harm is exploding. The framework says both{" "}
        <span className="italic font-normal">more</span> and{" "}
        <span className="italic font-normal">less</span> than that.
      </h2>
      <p className="font-body text-[15px] md:text-[17px] leading-[1.55] md:leading-[1.62] text-ink-soft mb-4 md:mb-5">
        Incident counts for conversational AI and self-harm rose sharply between 2024 and 2025 — the
        naive reading is that chatbots are becoming more dangerous. Separate exposure from harm and
        the picture inverts: use grew three times over while harm grew 1.7×, so each conversation
        became meaningfully <Em>safer</Em>. And yet absolute harm still rose. Both facts are true at
        once, and only the decomposition can hold them together.
      </p>
      <p className="font-body text-[15px] md:text-[17px] leading-[1.55] md:leading-[1.62] text-ink-soft">
        The point of the framework isn&apos;t to settle the verdict — nearly a third of the
        distribution lands on <Em>Unclassifiable</Em>, and the paper says so. It&apos;s to make the
        assumption stack visible — the bound construction, the proxy choices, the uncertainty
        factors — so that policy makers and practitioners can argue about the moves, not just the
        conclusion.
      </p>
      <div className="mt-6 md:mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <a
          href="/classifier"
          className="inline-block font-body text-[14px] md:text-[15px] px-4 py-2 md:px-5 md:py-2.5 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
        >
          Run the classifier on your own numbers →
        </a>
        <a
          href="/source_paper.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display italic text-[15px] text-accent-text hover:underline"
        >
          Read the paper ↗
        </a>
      </div>

      <div className="mt-7 pt-4 md:mt-12 md:pt-5 border-t border-rule font-body text-[13px] md:text-[14px] text-ink-faint">
        After{" "}
        <span className="font-display italic">
          A Pragmatic Classification Framework for AI Incident Monitoring
        </span>{" "}
        (2026).
      </div>
    </section>
  );
}

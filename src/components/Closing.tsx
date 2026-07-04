import { Em } from "@/components/Em";

export function Closing() {
  return (
    <section
      data-snap-landmark="end"
      className="min-h-screen flex flex-col justify-center mx-auto max-w-[720px] px-6 sm:px-8 py-28"
      aria-label="Closing"
    >
      <div className="font-display italic text-[17px] text-ink-faint mb-6">
        What the framework reveals
      </div>
      <h2 className="font-display font-medium text-[32px] sm:text-[40px] leading-[1.14] tracking-[-0.008em] text-ink mb-6">
        The headlines say chatbot harm is exploding. The framework says both{" "}
        <span className="italic font-normal">more</span> and{" "}
        <span className="italic font-normal">less</span> than that.
      </h2>
      <p className="font-body text-[17px] leading-[1.62] text-ink-soft mb-5">
        Incident counts for conversational AI and self-harm rose sharply between 2024 and 2025 — the
        naive reading is that chatbots are becoming more dangerous. Separate exposure from harm and
        the picture inverts: use grew three times over while harm grew 1.7×, so each conversation
        became meaningfully <Em>safer</Em>. And yet absolute harm still rose. Both facts are true at
        once, and only the decomposition can hold them together.
      </p>
      <p className="font-body text-[17px] leading-[1.62] text-ink-soft">
        The point of the framework isn&apos;t to settle the verdict — nearly a third of the
        probability mass lands on <Em>Unclassifiable</Em>, and the paper says so. It&apos;s to make
        the assumption stack visible — the bound construction, the proxy choices, the uncertainty
        factors — so that policy makers and practitioners can argue about the moves, not just the
        conclusion.
      </p>
      <div className="mt-12 pt-5 border-t border-rule font-body text-[14px] text-ink-faint">
        After{" "}
        <span className="font-display italic">
          A Pragmatic Classification Framework for AI Incident Monitoring
        </span>{" "}
        (2026).
      </div>
    </section>
  );
}

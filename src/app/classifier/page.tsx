import type { Metadata } from "next";
import Link from "next/link";
import "driver.js/dist/driver.css";
import { ClassifierTool } from "@/components/viz/ClassifierTool";

export const metadata: Metadata = {
  title: "The classifier — run your own trajectory classification",
  description:
    "An interactive tool: enter your own harm and exposure estimates, with their uncertainty, and read the probabilistic trajectory classification from the SORT framework.",
};

export default function ClassifierPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-6 sm:px-10 py-10 short:py-6">
      {/* Compact header strip. Natural document scroll — no viewport pin — so
          scrolling behaves normally when content exceeds a short screen. On
          short viewports the vertical chrome (margins, padding) tightens and
          the text measure widens so the intro wraps into fewer lines; combined
          with the height-scaled chart below, the body fits one screen without
          scrolling wherever it can, and scrolls the page natively when it can't. */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-rule pb-5 mb-8 short:pb-3 short:mb-4">
        <div className="max-w-[720px] short:max-w-[940px]">
          <div className="font-display italic text-[13px] text-ink-soft mb-1.5 short:mb-1">
            The classifier · a walk through the SORT framework
          </div>
          <h1 className="font-display font-medium text-[27px] sm:text-[31px] short:sm:text-[27px] leading-[1.1] tracking-[-0.012em] text-ink">
            Run the classification on{" "}
            <span className="italic font-normal text-accent-text">your own numbers.</span>
          </h1>
          <p className="font-body text-[14px] leading-[1.55] text-ink-soft mt-2 short:mt-1.5 short:leading-[1.45]">
            The walkthrough classifies one case. Give this tool your own point estimates for harm
            and exposure across two periods, plus how uncertain each is, and it runs the same
            probabilistic classifier — the whole thing lives on this one screen.
          </p>
        </div>
        <nav className="flex shrink-0 items-baseline gap-5 sm:flex-col sm:items-end sm:gap-2">
          <Link
            href="/"
            className="font-display italic text-[14px] text-accent-text hover:underline whitespace-nowrap"
          >
            ← Back to the walkthrough
          </Link>
          <a
            href="https://arxiv.org/abs/2604.19914"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body text-[13px] px-4 py-2 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors whitespace-nowrap"
          >
            Read the paper
          </a>
        </nav>
      </header>

      <ClassifierTool />
    </main>
  );
}

import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import type { ContentStep } from "./types";

// Act 1 — the problem with raw incident counts.

export const act1Steps: ContentStep[] = [
  {
    id: "1.1",
    render: (num) => (
      <StepText number={num} heading="Reports are climbing.">
        <p>
          The chart on the right plots monthly AI incidents and hazards recorded in the{" "}
          <a
            href="https://oecd.ai/en/incidents"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent-text/40 hover:decoration-accent-text text-accent-text"
          >
            OECD AI Incidents and Hazards Monitor
          </a>
          . By late 2025 the totals exceed five hundred a month.
        </p>
        <p>The shape of the line is unambiguous — but what it means is not.</p>
      </StepText>
    ),
  },
  {
    id: "1.2",
    render: (num) => (
      <StepText number={num} heading="A climbing line has three competing readings.">
        <p>The line might be rising because:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[17px] leading-snug">
          <li>
            AI is being deployed more widely, so the raw count grows without any change in severity
            or in the AI itself;
          </li>
          <li>
            Reporting infrastructure has improved, and journalists and researchers have become
            better at noticing AI-related harms that were already happening;
          </li>
          <li>Each use of AI is now more likely to cause harm than it used to be.</li>
        </ul>
        <p>
          These three readings require different responses to mitigate AI risks. Most likely all
          three are happening at once — the question is in what proportion, and the count alone
          cannot say.
        </p>
      </StepText>
    ),
  },
  {
    id: "1.3",
    render: (num) => (
      <StepText number={num} heading="Separate harm from exposure.">
        <p>
          The three readings cannot be untangled at the level of &ldquo;AI incidents in
          general.&rdquo; The category is too broad — different harms have different exposure
          denominators, different reporting infrastructures, and different deployment curves.
        </p>
        <p>
          The paper proposes a framework that works at a narrower level: pick one specific harm,
          estimate its <Em>harm</Em> and <Em>exposure</Em> separately, take the ratio, and classify
          the resulting trajectory of the risk.
        </p>
        <p>
          Three moves: define a precise monitoring question using the SORT framework; estimate harm
          and exposure <Em>independently</Em> across two periods; then take their ratio and classify
          the trajectory. Harm and exposure are two parallel estimates, not a sequence — neither
          depends on the other.
        </p>
      </StepText>
    ),
  },
];

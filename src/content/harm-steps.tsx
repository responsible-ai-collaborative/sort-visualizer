import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import { Assumption } from "@/components/Assumption";
import { TierLink } from "@/components/TierGuide";
import type { ContentStep } from "./types";

// Act 3a — estimating harm: the point estimate is the anchor; the AIID
// enters afterwards, only to check the lower band of the uncertainty
// interval.

export const harmSteps: ContentStep[] = [
  {
    id: "3.1",
    render: (num) => (
      <StepText number={num} heading="Harm — start from the point estimate.">
        <p>
          The estimate that carries the classification is a <Em>point estimate</Em>, built from the
          most suitable data available. Authoritative single sources rarely exist for AI harms,
          so this question sits at <TierLink tier={2}>Tier 2</TierLink> and anchors on OpenAI&apos;s{" "}
          <a
            href="https://openai.com/index/strengthening-chatgpt-responses-in-sensitive-conversations/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent-text/40 hover:decoration-accent-text text-accent-text"
          >
            own disclosures
          </a>
          : around <Em>0.15% of weekly active users</Em> have conversations with explicit indicators
          of potential suicidal planning or intent.
        </p>
        <p>
          Crucially, OpenAI also disclosed the ratio of <Em>desired to undesired</Em> model
          responses on those conversations, improving from roughly <Em>40:60</Em> (January 2024 –
          July 2025) to <Em>80:20</Em> (August–September 2025) to <Em>92:8</Em> (October–December
          2025).
        </p>
      </StepText>
    ),
  },
  {
    id: "3.2",
    render: (num) => (
      <StepText number={num} heading="Harm — ≈2.4M in 2024, ≈4M in 2025.">
        <p>
          Combining those ratios with estimated conversation volumes gives the point estimate of
          total harm — conversations in which the model&apos;s response was undesired: roughly{" "}
          <Em>2.4 million</Em> in 2024 and <Em>4 million</Em> in 2025.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.3",
    render: (num) => (
      <StepText number={num} heading="Then handle the uncertainty.">
        <p>
          The point estimate carries an uncertainty band, set by its{" "}
          <TierLink>methodological tier</TierLink>. Incident databases enter only here: when
          their recorded counts come reasonably close to the estimate, they raise the{" "}
          <Em>lower band</Em> — the true harm cannot fall below what has already been recorded.
        </p>
        <p>
          An LLM-assisted scan of the AI Incident Database returns <Em>2 full matches in 2024</Em>{" "}
          and <Em>12 in 2025</Em>, with the 2025 assessed harm count spanning{" "}
          <Em>10,014–110,025</Em> because three matches are composite narratives covering whole
          populations. This harm type has a low inclusion probability in incident databases, so the
          recorded floor sits orders of magnitude below the point estimate — it barely moves the
          band, and the classification rests on the point estimate alone.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.4",
    render: (num) => (
      <StepText number={num} heading="Harm trend — increasing, ×~1.7.">
        <p>
          Across the two periods the point estimate grows from <Em>≈2.4 million</Em> to{" "}
          <Em>≈4 million</Em> harmful conversations — a trend of <Em>increasing, ×~1.7</Em>.
        </p>
        <Assumption
          label={
            <>
              Confidence — <TierLink tier={2}>Tier 2</TierLink> · Medium
            </>
          }
        >
          Derived from reasonable publicly available proxy sources. The AIID&apos;s sparse recorded
          counts are directionally consistent with the point estimate, but lift the lower band of
          its uncertainty interval only marginally.
        </Assumption>
        <p>
          <TierLink tier={2} variant="button">
            Learn more about methodological tiers →
          </TierLink>
        </p>
      </StepText>
    ),
  },
];

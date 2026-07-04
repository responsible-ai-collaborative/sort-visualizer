import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import { Assumption } from "@/components/Assumption";
import type { ContentStep } from "./types";

// Act 3a — estimating harm: two lower bounds, then the point estimate.

export const harmSteps: ContentStep[] = [
  {
    id: "3.1",
    render: (num) => (
      <StepText number={num} heading="Harm, source one — the AI Incident Database.">
        <p>
          Authoritative single sources rarely exist for AI harms, so the procedure starts with what
          incident databases can supply: a hard <Em>lower bound</Em>. The true harm cannot fall
          below what has already been recorded.
        </p>
        <p>
          An LLM-assisted scan of the AIID returns <Em>2 full matches in 2024</Em> and{" "}
          <Em>12 in 2025</Em> — but the 2025 assessed harm count explodes to <Em>10,014–110,025</Em>
          , because three of the matches are composite narratives covering whole populations: an APA
          warning about AI chatbots on Character.AI, an OpenAI statement on users showing signs of
          suicidal ideation, and an assessment of chatbot personas designed to promote self-harm.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.2",
    render: (num) => (
      <StepText number={num} heading="Source two — OECD AIM joins the lower bound.">
        <p>
          The OECD AI Incidents Monitor uses a different sourcing pipeline from the AIID. Filtered
          for US-based incidents involving chatbots or content generation and resulting in death,
          physical or psychological injury, the same LLM analysis yields{" "}
          <Em>8 full matches in 2024</Em> and <Em>77 in 2025</Em>.
        </p>
        <p>
          Most matching entries are duplicates, lawsuits, or composite narratives. Removing them
          leaves <Em>1 individual case of suicide in 2024</Em> and{" "}
          <Em>3 individual cases of suicide, murder-suicide or self-harm in 2025</Em>. Two
          independent floors, both rising — but floors this sparse cannot carry a trend claim alone.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.3",
    render: (num) => (
      <StepText number={num} heading="From floor to point estimate.">
        <p>
          For a Tier 2 point estimate, the paper turns to OpenAI&apos;s{" "}
          <a
            href="https://openai.com/index/strengthening-chatgpt-responses-in-sensitive-conversations/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent-text/40 hover:decoration-accent-text text-accent-text"
          >
            own disclosures
          </a>
          : around <Em>0.15% of weekly active users</Em> have conversations with explicit indicators
          of potential suicidal planning or intent — and, crucially, the disclosed ratio of{" "}
          <Em>desired to undesired</Em> model responses on those conversations improved from roughly{" "}
          <Em>40:60</Em> (January 2024 – July 2025) to <Em>80:20</Em> (August–September 2025) to{" "}
          <Em>92:8</Em> (October–December 2025).
        </p>
        <p>
          Combining those ratios with estimated conversation volumes gives a point estimate of total
          harm: conversations in which the model&apos;s response was undesired.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.4",
    render: (num) => (
      <StepText number={num} heading="Harm — ≈2.4M in 2024, ≈4M in 2025.">
        <p>
          The point estimate lands at roughly <Em>2.4 million</Em> harmful conversations in 2024 and{" "}
          <Em>4 million</Em> in 2025 — a trend of <Em>increasing, ×~1.7</Em>.
        </p>
        <Assumption label="Confidence — Tier 2 · Medium">
          Derived from reasonable publicly available proxy sources. The lower-bound estimates,
          although individually unrepresentative, are directionally consistent with the point
          estimate. This harm type has a low inclusion probability in incident databases — which is
          why the floors sit six orders of magnitude below the point estimate.
        </Assumption>
      </StepText>
    ),
  },
];

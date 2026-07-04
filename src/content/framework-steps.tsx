import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import type { ContentStep } from "./types";

// The two standalone framework reveals: the 2×2 output preview ("fo") and
// the estimation-tier table ("tr").

export const frameworkOutputSteps: ContentStep[] = [
  {
    id: "fo.1",
    render: (num) => (
      <StepText number={num} heading="What this procedure produces.">
        <p>
          The framework&apos;s output is a single dot on a 2 × 2 grid. One axis tracks exposure (
          <Em>E</Em>) — is the opportunity for harm growing or shrinking? The other tracks harm per
          unit exposure (<Em>Ĥ</Em>) — is each interaction more or less likely to cause harm than
          before?
        </p>
        <ul className="list-none space-y-1.5 mt-2 text-[15px]">
          <li>
            <Em>Escalating</Em> — both growing. Urgent attention.
          </li>
          <li>
            <Em>Mitigating</Em> — exposure growing, harm-rate falling. Monitor closely.
          </li>
          <li>
            <Em>Concentrating</Em> — exposure shrinking, harm-rate growing. Targeted measures.
          </li>
          <li>
            <Em>Receding</Em> — both shrinking or flat. Continue strategy.
          </li>
        </ul>
        <p>
          And when the evidence cannot support even a directional call, the framework does something
          raw counts never do: it <Em>abstains</Em>. Keep that fifth outcome in mind — it returns at
          the end.
        </p>
      </StepText>
    ),
  },
];

export const tierReliabilitySteps: ContentStep[] = [
  {
    id: "tr.1",
    render: (num) => (
      <StepText number={num} heading="Classifying source reliability.">
        <p>
          Answering a monitoring question means estimating two numbers across consecutive time
          periods — the harm associated with the risk event, and the exposure defined by the subject
          and opportunity. Both estimates rest on whatever sources the data environment makes
          available, and those sources vary widely in how directly they speak to the question.
        </p>
        <p>
          The paper sorts estimation methods into four tiers by the strength of the underlying
          evidence. Click on each of the rows to learn more about the tier classification.
        </p>
      </StepText>
    ),
  },
];

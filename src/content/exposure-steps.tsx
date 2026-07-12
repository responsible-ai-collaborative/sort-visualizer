import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import { Assumption } from "@/components/Assumption";
import { TierLink } from "@/components/TierGuide";
import type { ContentStep } from "./types";

// Act 3b — estimating exposure: the proxy funnel, then the estimate.

export const exposureSteps: ContentStep[] = [
  {
    id: "3.5",
    render: (num) => (
      <StepText number={num} heading="Exposure — a funnel of proxies.">
        <p>
          Exposure is <Em>the opportunity for harm to occur</Em> — here, the number of conversations
          matching the opportunity, not the number of users. No one publishes that number, so it is
          assembled from a funnel of partial sources.
        </p>
        <p>
          ChatGPT&apos;s weekly active users grew from <Em>140 million</Em> (January 2024) to{" "}
          <Em>300 million</Em> (January 2025) to <Em>≈850 million</Em> (December 2025). Scaling up
          by OpenAI&apos;s share of generative-AI web traffic (<Em>~75% falling to ~60%</Em>) covers
          all conversational AI; scaling down to the <Em>~18%</Em> of users based in the US gives{" "}
          <Em>≈34 million</Em> US weekly active users in January 2024, rising to{" "}
          <Em>≈243 million</Em> by December 2025.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.6",
    render: (num) => (
      <StepText number={num} heading="Exposure — ≈4M conversations in 2024, ≈12M in 2025.">
        <p>
          Applying OpenAI&apos;s 0.15% rate to those user counts, week by week, and summing each
          year: approximately <Em>4 million</Em> conversations matching the opportunity in 2024 and{" "}
          <Em>12 million</Em> in 2025. The trend is <Em>increasing, ×~3</Em>.
        </p>
        <Assumption
          label={
            <>
              Confidence — <TierLink tier={2}>Tier 2</TierLink> · Medium
            </>
          }
        >
          Reasonable public proxies, explicit assumptions. The main limitation is aggregation bias:
          ChatGPT data proxies for all conversational AI platforms, and conversations are treated as
          equivalent regardless of user age — while OpenAI&apos;s share of a sharply growing market
          fell over the period, so any error in generalizing its figures has a proportionally
          greater effect.
        </Assumption>
      </StepText>
    ),
  },
];

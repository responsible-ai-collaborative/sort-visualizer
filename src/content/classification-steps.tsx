import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import type { ContentStep } from "./types";

// Act 4 — classification: dot placement, probabilistic weights, verdict.

export const classificationSteps: ContentStep[] = [
  {
    id: "4.1",
    render: (num) => (
      <StepText number={num} heading="Take the ratio — the dot lands in Mitigating.">
        <p>
          Plot the chatbot case. Harm grew <Em>×~1.7</Em> while exposure grew <Em>×~3</Em> — so harm{" "}
          <Em>per unit of exposure</Em> fell by a factor of about <Em>0.55</Em>, against a rising
          exposure base.
        </p>
        <p>
          Ĥ down, E up: the dot lands in the bottom-right quadrant, <Em>Mitigating</Em>. Per
          conversation, these systems are getting safer — even as more people than ever have the
          conversations.
        </p>
      </StepText>
    ),
  },
  {
    id: "4.2",
    render: (num) => (
      <StepText number={num} heading="How confident is that placement?">
        <p>
          The estimates behind the dot carry real uncertainty — a factor of ~2 on each harm
          estimate, ~1.5 on each exposure estimate. The paper treats each quantity as log-normal,
          samples all four by Monte Carlo, and classifies every draw. The result is not a cell but a{" "}
          <Em>distribution</Em>:
        </p>
        <ul className="list-none space-y-1.5 mt-2 text-[16px]">
          <li>
            <Em>Mitigating</Em> — 58.6%
          </li>
          <li>
            <Em>Unclassifiable</Em> — 31.6%
          </li>
          <li>
            <Em>Escalating</Em> — 9.8%
          </li>
        </ul>
        <p>
          The fifth outcome, <Em>Unclassifiable</Em>, absorbs the draws where a trend is too weak to
          call. Uncertainty shows up in the shape of the distribution, not as false confidence.
        </p>
      </StepText>
    ),
  },
  {
    id: "4.3",
    render: (num) => (
      <StepText number={num} heading="Verdict — Mitigating, read alongside absolute harm.">
        <p>
          Per-unit-exposure harm is decreasing while more people are exposed: existing safeguards
          appear to be working, and the classification is <Em>Mitigating</Em> at Medium confidence.
        </p>
        <p>
          But the classification says nothing about absolute scale. Roughly four million harmful
          conversations is <Em>more</Em> than the year before — a Mitigating trajectory can coexist
          with large and growing absolute harm. A naive reading of the incident counts would have
          called this system more dangerous; the framework says it is becoming safer per use while
          the harm still grows.
        </p>
      </StepText>
    ),
  },
  {
    id: "4.4",
    render: (num) => (
      <StepText number={num} heading="Don't take our word for it — move the assumptions.">
        <p>
          Nothing about those weights is hand-tuned: they fall out of the Monte Carlo given the
          estimates, two uncertainty factors, and an indifference band. The sliders start at the
          paper&apos;s values — each faint point is one draw of the classifier.
        </p>
        <p>
          Widen the harm uncertainty and watch the distribution drain into <Em>Unclassifiable</Em>.
          Shrink the indifference band and the verdict sharpens. Push harm growth past exposure
          growth and the dot crosses into <Em>Escalating</Em>. The conclusion is only as strong as
          the assumptions — and now you can check which ones carry it.
        </p>
        <p className="mt-3">
          <a
            href="/classifier"
            className="inline-block font-body text-[14px] px-4 py-2 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
          >
            Run it on your own numbers ↗
          </a>
        </p>
      </StepText>
    ),
  },
];

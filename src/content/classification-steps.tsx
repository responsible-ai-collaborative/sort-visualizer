import Link from "next/link";
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
          The estimates behind the dot carry real uncertainty, depending on applicability of the
          proxy data to the monitoring question, and the reliability of the data itself. Ultimately
          this remains a judgement call of the analyst, which we here estimate with an uncertainty
          factor of ~2 on the harm estimate, and ~1.5 on the exposure estimate. The paper treats both
          as log-normal distributions and uses Monte Carlo sampling to obtain a <Em>distribution</Em>{" "}
          over classifications:
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
          A draw falls into <Em>Unclassifiable</Em> when its trend is too weak to be robust — small
          perturbations would flip it into a different class. Where to set this threshold, i.e. how
          strong a trend must be before it counts, is again a judgement call by the analyst.
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
          Nothing about those weights is hand-tuned: they fall out of the Monte Carlo simulation
          given the estimates, two uncertainty factors, and an indifference band. The sliders start
          at the
          paper&apos;s values — each faint point is one draw of the classifier.
        </p>
        <p>
          Widen the harm uncertainty and watch the distribution drain into <Em>Unclassifiable</Em>.
          Shrink the indifference band and the verdict sharpens. Push harm growth past exposure
          growth and the dot crosses into <Em>Escalating</Em>. The conclusion is only as strong as
          data that feed into it, and the confidence of the analyst, and now you can check which ones
          carry it.
        </p>
        <p className="mt-3">
          <Link
            href="/classifier"
            className="inline-block font-body text-[14px] px-4 py-2 border border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
          >
            Run it on your own numbers ↗
          </Link>
        </p>
      </StepText>
    ),
  },
];

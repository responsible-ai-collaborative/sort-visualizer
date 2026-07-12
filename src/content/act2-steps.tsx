import { StepText } from "@/components/steps/StepText";
import { Disclosure } from "@/components/steps/Disclosure";
import { Em } from "@/components/Em";
import { Assumption } from "@/components/Assumption";
import type { ContentStep } from "./types";

// Act 2 — building the SORT monitoring question for the chatbot case.

export const act2Steps: ContentStep[] = [
  {
    id: "2.1",
    render: (num) => (
      <StepText number={num} heading="A monitoring question has four parts.">
        <p>
          SORT — <Em>Subject, Opportunity, Risk event, Timeframe</Em> — is the paper&apos;s
          structured analogue to{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/7582737/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent-text/40 hover:decoration-accent-text text-accent-text"
          >
            PICO
          </a>{" "}
          in evidence-based medicine. It forces analytical choices to be explicit rather than buried
          in framing.
        </p>
        <p>
          Each box on the right holds one piece of the question. They will fill in one at a time as
          you scroll, using the case study of conversational AI and self-harm.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.2",
    render: (num) => (
      <StepText number={num} heading="Subject — who or what is at risk.">
        <p>
          The subject need not be a population of people — it can be systems, content, deployments,
          or <Em>conversations</Em>. The paper&apos;s choice here is deliberately fine-grained:{" "}
          <Em>conversations between US users and conversational AI systems</Em>.
        </p>
        <p>
          Counting conversations rather than people fixes the unit of analysis for everything
          downstream: exposure will be a conversation count, and harm a count of conversations that
          go wrong.
        </p>
        <Disclosure label="Examples from other domains">
          <p className="font-body italic text-[14px] leading-snug text-ink-soft">
            Example subjects: Workers in customer-service roles in California; registered AV-capable
            vehicles; hospital patients in NHS England trusts.
          </p>
        </Disclosure>
      </StepText>
    ),
  },
  {
    id: "2.3",
    render: (num) => (
      <StepText number={num} heading="Opportunity — what creates the exposure.">
        <p>
          Opportunity isolates the specific mechanism through which the subject is exposed to the
          harm. Simply &ldquo;conversations with AI&rdquo; would cast too wide a net. It is the{" "}
          <strong>precise interaction pattern</strong> that makes the risk event possible.
        </p>
        <p>
          Here: conversations{" "}
          <Em>in which users seek support regarding suicidal ideation or self-harm</Em>. The
          narrower the opportunity, the tighter the proxy choices available to estimate exposure
          later.
        </p>
        <Disclosure label="Examples from other domains">
          <p className="font-body italic text-[14px] leading-snug text-ink-soft">
            Example opportunities: Being screened by an automated resume-filtering system during a
            job application; operating in self-driving mode on public roads; receiving a diagnosis
            assisted by a clinical decision-support tool.
          </p>
        </Disclosure>
      </StepText>
    ),
  },
  {
    id: "2.4",
    render: (num) => (
      <StepText number={num} heading="Risk event — the specific harm.">
        <p>
          The risk event is the countable harm itself, phrased so that an incident report can be
          matched against it. The paper specifies: the{" "}
          <Em>AI encourages, or fails to discourage, suicidal ideation or self-harm</Em>.
        </p>
        <p>
          A vaguer phrasing — &ldquo;AI causes mental health harms&rdquo; — would inflate the number
          of partial matches and make the trend signal noisier. A high ratio of partial to full
          matches is the framework&apos;s built-in warning that a question may be overspecified.
        </p>
        <Disclosure label="Examples from other domains">
          <p className="font-body italic text-[14px] leading-snug text-ink-soft">
            Example risk events: Being rejected from consideration on the basis of a protected
            characteristic; causing injury or loss of life; receiving a missed or delayed diagnosis
            traceable to the tool&apos;s recommendation.
          </p>
        </Disclosure>
      </StepText>
    ),
  },
  {
    id: "2.5",
    render: (num) => (
      <StepText number={num} heading="Timeframe — the unit of comparison.">
        <p>
          Timeframe defines the observation window. <Em>Per calendar year</Em> is chosen here,
          comparing <Em>T1 = 2024</Em> against <Em>T2 = 2025</Em> — the framework always compares
          two periods to produce a trend, not an absolute level.
        </p>
        <Disclosure label="Examples from other domains">
          <p className="font-body italic text-[14px] leading-snug text-ink-soft">
            Example timeframes: per quarter, fiscal year, or million vehicle-miles.
          </p>
        </Disclosure>
      </StepText>
    ),
  },
  {
    id: "2.6",
    render: (num) => (
      <StepText number={num} heading="Assembled, the monitoring question reads:">
        <p>
          That single sentence is the unit of analysis. Everything downstream — which databases to
          search, which proxies to allow, what counts as a full match — flows from its exact
          phrasing.
        </p>
        <Assumption label="Why this matters">
          A monitoring question that is too narrow yields too few matches for a reliable trend. Too
          broad and the matches blur unrelated harms. You can use this{" "}
          <a
            href="https://claude.ai/public/artifacts/9ec3813a-399c-48ea-96ed-19443d121b83"
            target="_blank"
            rel="noopener noreferrer"
            className="not-italic underline decoration-accent-text/40 hover:decoration-accent-text text-accent-text"
          >
            Claude artifact
          </a>{" "}
          to experiment with creating your own SORT questions.
        </Assumption>
      </StepText>
    ),
  },
];

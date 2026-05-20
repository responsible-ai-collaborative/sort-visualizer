"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header } from "@/components/Header";
import { PivotSection } from "@/components/PivotSection";
import { Closing } from "@/components/Closing";
import { NavArrows } from "@/components/NavArrows";
import { TuningPanel } from "@/components/TuningPanel";
import { ScrollySection, type StepDef } from "@/components/ScrollySection";
import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import { Assumption } from "@/components/Assumption";
import { IncidentsChart } from "@/components/viz/IncidentsChart";
import { FrameworkOutputViz } from "@/components/viz/FrameworkOutputViz";
import { SortAssembly } from "@/components/viz/SortAssembly";
import { TierTable } from "@/components/viz/TierTable";
import { EstimationPanels } from "@/components/viz/EstimationPanels";
import { Act4Quadrant } from "@/components/viz/Act4Quadrant";
import { Act5Quadrant } from "@/components/viz/Act5Quadrant";
import { ProgressStepper } from "@/components/ProgressStepper";
import { STAGES, type StageId } from "@/lib/stages";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const act1Steps: StepDef[] = [
  {
    id: "1.1",
    element: (
      <StepText number="01" heading="Reports are climbing.">
        <p>
          The chart on the right plots monthly AI incidents recorded in the{" "}
          <a
            href="https://incidentdatabase.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent/40 hover:decoration-accent text-accent"
          >
            AI Incident Database
          </a>{" "}
          since 2016.
        </p>
        <p>
          The shape of the line is unambiguous — but what it means is not.
        </p>
      </StepText>
    ),
  },
  {
    id: "1.2",
    element: (
      <StepText number="02" heading="A climbing line has three competing readings.">
        <p>The line might be rising because:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[17px] leading-snug">
          <li>
            AI is being deployed more widely, so the raw count grows without
            any change in severity or in the AI itself;
          </li>
          <li>
            Reporting infrastructure has improved, and journalists and
            researchers have become better at noticing AI-related harms that
            were already happening;
          </li>
          <li>
            Each use of AI is now more likely to cause harm than it used to be.
          </li>
        </ul>
        <p>
          These three readings require different responses to mitigate AI
          risks. Most likely all three are happening at once — the question is
          in what proportion, and the count alone cannot say.
        </p>
      </StepText>
    ),
  },
  {
    id: "1.3",
    element: (
      <StepText number="03" heading="Separate harm from exposure.">
        <p>
          The three readings cannot be untangled at the level of &ldquo;AI
          incidents in general.&rdquo; The category is too broad — different
          harms have different exposure denominators, different reporting
          infrastructures, and different deployment curves.
        </p>
        <p>
          Slattery et al. (2026) propose a framework that works at a narrower
          level: pick one specific harm, estimate its <Em>harm</Em> and{" "}
          <Em>exposure</Em> separately, take the ratio, and classify the
          resulting trajectory of the risk.
        </p>
        <p>
          The four steps: define a precise monitoring question using the SORT
          framework, estimate harm and exposure independently, take their
          ratio, and classify the result.
        </p>
      </StepText>
    ),
  },
];

const frameworkOutputSteps: StepDef[] = [
  {
    id: "fo.1",
    element: (
      <StepText number="04" heading="What this procedure produces.">
        <p>
          To better understand its current trajectory, the framework classifies
          a given AI risk into one of four quadrants.
        </p>
        <p>
          The framework&apos;s output is a single dot on a 2 × 2 grid. One axis
          tracks exposure (<Em>E</Em>) — is the population at risk growing or
          shrinking? The other tracks harm per unit exposure (<Em>Ĥ</Em>) — is
          each interaction more or less likely to cause harm than before?
        </p>
        <ul className="list-none space-y-1.5 mt-2 text-[15px]">
          <li>
            <Em>Escalating</Em> — both growing. Urgent attention.
          </li>
          <li>
            <Em>Mitigating</Em> — exposure growing, harm-rate falling. Monitor
            closely.
          </li>
          <li>
            <Em>Concentrating</Em> — exposure shrinking, harm-rate growing.
            Targeted measures.
          </li>
          <li>
            <Em>Receding</Em> — both shrinking or flat. Continue strategy.
          </li>
        </ul>
        <p>
          By defining a specific harm, estimating the two trends separately,
          then placing them on the grid, we can develop a better view of how AI
          risks are developing, and why.
        </p>
      </StepText>
    ),
  },
];

const act2Steps: StepDef[] = [
  {
    id: "2.1",
    element: (
      <StepText number="05" heading="A monitoring question has four parts.">
        <p>
          SORT — <Em>Subject, Opportunity, Risk event, Timeframe</Em> — is the
          paper&apos;s structured analogue to{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/7582737/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent/40 hover:decoration-accent text-accent"
          >
            PICO
          </a>{" "}
          in evidence-based medicine. It forces analytical choices to be
          explicit rather than buried in framing.
        </p>
        <p>
          Each box on the right holds one piece of the question. They will fill
          in one at a time as you scroll, using the case study of conversational
          AI and self-harm.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.2",
    element: (
      <StepText number="06" heading="Subject — who or what is at risk.">
        <p>
          The subject is the population whose welfare is at stake. The choice
          has to be narrow enough to be measurable, broad enough to capture the
          phenomenon actually in question.
        </p>
        <p>
          For this case: <Em>people living in the United States</Em>. The choice
          of country fixes the available denominators downstream — censuses,
          regulatory filings, survey instruments.
        </p>
        <p className="font-body italic text-[14px] leading-snug text-ink-soft">
          Example subjects: Workers in customer-service roles in California;
          hospital patients in NHS England trusts; drivers on US interstate
          highways.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.3",
    element: (
      <StepText number="07" heading="Opportunity — what creates the exposure.">
        <p>
          Opportunity isolates the specific mechanism through which the subject
          is exposed to the harm. Simply &ldquo;people who use AI&rdquo; would
          cast too wide a net. It is the <strong>precise interaction pattern</strong>{" "}
          that makes the risk event possible.
        </p>
        <p>
          Here: <Em>using conversational AI systems for emotional support</Em>.
          The narrower the opportunity, the tighter the proxy choices available
          to estimate exposure later.
        </p>
        <p className="font-body italic text-[14px] leading-snug text-ink-soft">
          Example opportunities: Being screened by an automated resume-filtering
          system during a job application; receiving a diagnosis assisted by a
          clinical decision-support tool; driving alongside a vehicle operating
          in autonomous mode.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.4",
    element: (
      <StepText number="08" heading="Risk event — the specific harm.">
        <p>
          The risk event is the countable harm itself, phrased so that an
          incident report can be matched against it. The paper specifies:{" "}
          <Em>
            receiving responses that encourage, or fail to discourage, suicidal
            ideation or self-harm
          </Em>
          .
        </p>
        <p>
          A vaguer phrasing — &ldquo;AI causes mental health harms&rdquo; —
          would inflate the number of partial matches and make the trend signal
          noisier.
        </p>
        <p className="font-body italic text-[14px] leading-snug text-ink-soft">
          Example risk events: Being rejected from consideration on the basis
          of a protected characteristic; receiving a missed or delayed diagnosis
          traceable to the tool&apos;s recommendation; being involved in a
          collision the autonomous system failed to avoid.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.5",
    element: (
      <StepText number="09" heading="Timeframe — the unit of comparison.">
        <p>
          Timeframe defines the observation window. <Em>Per calendar year</Em>{" "}
          is the default chosen here: the underlying databases publish in
          year-resolution, and year-on-year change is what the framework is
          trying to surface.
        </p>
        <p className="font-body italic text-[14px] leading-snug text-ink-soft">
          Example timeframes: per quarter, fiscal year, or month.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.6",
    element: (
      <StepText number="10" heading="Assembled, the monitoring question reads:">
        <p>
          That single sentence is the unit of analysis. Everything downstream —
          which databases to search, which proxies to allow, what counts as a
          full match — flows from its exact phrasing.
        </p>
        <Assumption label="Why this matters">
          A monitoring question that is too narrow yields too few matches for a
          reliable trend. Too broad and the matches blur unrelated harms. You
          can use this{" "}
          <a
            href="https://claude.ai/public/artifacts/9ec3813a-399c-48ea-96ed-19443d121b83"
            target="_blank"
            rel="noopener noreferrer"
            className="not-italic underline decoration-accent/40 hover:decoration-accent text-accent"
          >
            Claude artifact
          </a>{" "}
          to experiment with creating your own SORT questions.
        </Assumption>
      </StepText>
    ),
  },
];

const tierReliabilitySteps: StepDef[] = [
  {
    id: "tr.1",
    element: (
      <StepText number="11" heading="Classifying source reliability.">
        <p>
          Answering a monitoring question means estimating two numbers across
          consecutive time periods — the harm associated with the risk event,
          and the exposure defined by the subject and opportunity. Both
          estimates rest on whatever sources the data environment makes
          available, and those sources vary widely in how directly they speak
          to the question.
        </p>
        <p>
          The paper sorts estimation methods into four tiers by the strength of
          the underlying evidence. Click on each of the rows to learn more
          about the tier classification.
        </p>
      </StepText>
    ),
  },
];

const act3HarmSteps: StepDef[] = [
  {
    id: "3.1",
    element: (
      <StepText number="12" heading="Harm, source one — the AI Incident Database.">
        <p>
          With no authoritative single source for this monitoring question, the
          procedure begins at <Em>Tier 2</Em> — combining proxy measures to
          construct bounds.
        </p>
        <p>
          An LLM-assisted scan of the AIID returns <Em>2 full matches in 2024</Em>{" "}
          and <Em>17 in 2025</Em>. Two matches in 2024 falls below the threshold
          for a reliable signal, so this database alone cannot resolve the trend.
          A second source is needed.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.2",
    element: (
      <StepText number="13" heading="Source two — OECD AIM carries the trend.">
        <p>
          The OECD AI Incidents Monitor uses a different sourcing pipeline from
          the AIID, drawing on a broader set of news and regulatory feeds.
          Filtered for US-based incidents involving conversational AI and
          resulting in physical or psychological injury, the same LLM analysis
          yields <Em>8 full matches in 2024</Em> and <Em>55 in 2025</Em> — a
          roughly seven-fold increase in the match count.
        </p>
        <p>
          The associated <Em>harm counts</Em> — the number of people affected
          per matched incident — also jump sharply, from a 9–17 range in 2024
          to roughly the hundred-thousand range in 2025. This second number is
          driven by a small number of incidents involving large user
          populations (a single platform-level event can put hundreds of
          thousands into the affected count), so it&apos;s noisier than the
          match count and shouldn&apos;t be read as a clean signal of
          per-incident severity. The match count is the load-bearing trend
          signal here.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.3",
    element: (
      <StepText number="14" heading="An upper bound from a single proxy.">
        <p>
          For an upper-bound estimate, the paper draws on OpenAI&apos;s{" "}
          <a
            href="https://techcrunch.com/2025/10/27/openai-says-over-a-million-people-talk-to-chatgpt-about-suicide-weekly/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent/40 hover:decoration-accent text-accent"
          >
            own disclosure
          </a>
          : approximately <Em>0.15% of weekly active users</Em> engage in
          conversations indicating potential suicidal planning or intent —
          more than one million people per week, globally.
        </p>
        <p>
          That number is not a lower-bound match count — it&apos;s a ceiling
          derived from a proxy proportion. The two kinds of evidence belong on
          different scales: the AIID and OECD AIM counts are floors built from
          confirmed reports, while the OpenAI figure is a roof scaled from a
          population-level rate.
        </p>
        <Assumption label="Confidence — Tier 2 · Low">
          The trend claim is <em>increasing</em>, anchored by OECD AIM&apos;s
          match-count jump from 8 to 55. AIID corroborates the direction but
          its 2024 count falls below the three-match threshold for an
          independent signal. The OpenAI ceiling rules out the harm being
          negligible but is global rather than US-specific. Tightening the
          tier would require either expert elicitation or close monitoring of
          2026 data.
        </Assumption>
      </StepText>
    ),
  },
];

const act3ExposureSteps: StepDef[] = [
  {
    id: "3.4",
    element: (
      <StepText number="15" heading="The Pew proxy, plus a scaling assumption.">
        <p>
          Pew Research data on ChatGPT use{" "}
          <Em>&ldquo;to learn new things&rdquo;</Em> and{" "}
          <Em>&ldquo;for entertainment&rdquo;</Em> by age group serves as the
          proxy frontier. The mid-point of those two shares becomes the point
          estimate; the individual shares form the lower and upper bounds.
        </p>
        <p>
          To extend from ChatGPT to all conversational AI, the paper applies a
          market-share scalar: <Em>80%</Em> at the point estimate, <Em>90%</Em>{" "}
          and <Em>70%</Em> for the upper and lower bounds.
        </p>
        <Assumption label="Assumption stack — exposure">
          The Pew share answering &ldquo;for entertainment&rdquo; serves as the
          lower bound on emotional-support use; the share answering &ldquo;to
          learn new things&rdquo; serves as the upper bound; the mid-point of
          the two serves as the central estimate. These shares are then applied
          uniformly to the US census population in matching age groups, and
          scaled by an assumed ChatGPT market share of LLM personal use.
        </Assumption>
      </StepText>
    ),
  },
  {
    id: "3.5",
    element: (
      <StepText number="16" heading="Exposure — 64M in 2024, 88M in 2025.">
        <p>
          Combining the assumption stack with the Pew bucket data and the US
          census yields a central estimate of <Em>64 million</Em> people in 2024
          (plausible range 54–73M) and <Em>88 million</Em> in 2025 (75–99M).
          Order of magnitude: 10⁸.
        </p>
        <p>
          The trend is <Em>increasing — approximately 40% year on year</Em>.
          Confidence tier 2 · Medium: the bounds are derived from reasonable
          sources, the assumptions are explicit, and the directional reading is
          robust to the moves used to construct it.
        </p>
      </StepText>
    ),
  },
];

const act4Steps: StepDef[] = [
  {
    id: "4.1",
    element: (
      <StepText number="17" heading="The chatbot case lands in the top-right.">
        <p>
          Plot the chatbot case. OECD AIM&apos;s match count jumped roughly
          seven-fold between 2024 and 2025. Exposure rose ~40% over the same
          period. Harm grew faster than exposure, so harm-per-exposure —{" "}
          <Em>Ĥ</Em> — is rising. Exposure is also rising, so <Em>E</Em> is up.
        </p>
        <p>
          Both arrows point up. The dot lands in the top-right quadrant:{" "}
          <Em>Escalating</Em>.
        </p>
      </StepText>
    ),
  },
  {
    id: "4.2",
    element: (
      <StepText number="18" heading="Verdict — Escalating.">
        <p>
          Both the population at risk and the harm per unit exposure are
          growing. The framework&apos;s recommendation: <Em>urgent attention</Em>{" "}
          — expanded monitoring, active investigation into causal drivers, and
          possibly regulatory intervention.
        </p>
        <p>
          The confidence tier is Low; tightening it would require either
          mandatory disclosure of conversational-AI use or a dedicated survey
          instrument. Both fall outside the current data environment.
        </p>
      </StepText>
    ),
  },
];

const act5Steps: StepDef[] = [
  {
    id: "5.1",
    element: (
      <StepText number="19" heading="Now apply the same framework to autonomous vehicles.">
        <p>
          NHTSA&apos;s mandatory reporting puts the procedure at <Em>Tier 1</Em>{" "}
          for harm: ADS incidents rose from <Em>526 in 2024</Em> to{" "}
          <Em>975 in 2025</Em>, an 85% increase — primarily driven by
          property-damage cases rather than injuries.
        </p>
        <p>
          A headline that, on its own, would suggest the framework&apos;s most
          urgent classification. The chatbot dot from the previous section is
          ghosted for comparison.
        </p>
      </StepText>
    ),
  },
  {
    id: "5.2",
    element: (
      <StepText number="20" heading="But exposure doubled in the same period.">
        <p>
          The point estimate for AV exposure puts it at <Em>78M miles in 2024</Em>{" "}
          and <Em>156M miles in 2025</Em>, drawn from the Autonomous Vehicle
          Industry Association&apos;s whole-year totals and Waymo&apos;s
          published ride velocity. Exposure roughly doubled — a 100% increase
          against the harm side&apos;s 85%.
        </p>
        <Assumption label="Exposure assumption stack — AV">
          The point estimate uses the AVIA anchor and assumes the monthly
          growth rate implied by Waymo&apos;s 2025 trajectory. The lower bound
          uses AVIA&apos;s May 2024 and May 2025 totals as whole-year proxies.
          The upper bound increases the point estimate by 10%.
        </Assumption>
      </StepText>
    ),
  },
  {
    id: "5.3",
    element: (
      <StepText number="21" heading="Verdict — Mitigating.">
        <p>
          Exposure growth (≈100%) outpaces harm growth (≈85%), yielding a{" "}
          <Em>decreasing</Em> harm-per-exposure trend against rising exposure.
          Fewer incidents occur per million vehicle-miles than the year before.
        </p>
        <p>
          Same procedure. Same direction on raw harm. Opposite governance
          implication. The framework&apos;s value is that it makes the second
          number — the exposure denominator — visible enough to change the
          verdict.
        </p>
        <p>
          The harm side is Tier 1 (NHTSA mandatory reporting), but exposure
          remains Tier 2 — AVIA and Waymo disclosures are the best available,
          not authoritative. Mandatory mile-reporting from AV operators would
          lift exposure to Tier 1 and tighten the verdict considerably.
        </p>
      </StepText>
    ),
  },
];

export default function Page() {
  const mainRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState<StageId | null>(null);

  // One ScrollTrigger per stage. Each one sets the active stage when its
  // section's top crosses 60% from viewport top (scrolling down or up). The
  // first and last stages additionally clear the active state when scrolling
  // out of the framework on either end.
  useGSAP(
    () => {
      const triggers = STAGES.map((stage, index) => {
        const isFirst = index === 0;
        const isLast = index === STAGES.length - 1;
        return ScrollTrigger.create({
          trigger: `#${stage.sectionId}`,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveStage(stage.id),
          onEnterBack: () => setActiveStage(stage.id),
          onLeaveBack: isFirst ? () => setActiveStage(null) : undefined,
          onLeave: isLast ? () => setActiveStage(null) : undefined,
        });
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: mainRef },
  );

  return (
    <main ref={mainRef} className="relative z-10">
      <ProgressStepper activeStage={activeStage} />
      <NavArrows />
      <TuningPanel />
      <Header />

      <ScrollySection
        steps={act1Steps}
        Viz={IncidentsChart}
        sectionId="act-1"
        ariaLabel="Act 1: The problem with raw incident counts"
        vizAriaLabel="A monthly incidents chart from 2020 to 2026, climbing year over year."
      />

      <ScrollySection
        steps={frameworkOutputSteps}
        Viz={FrameworkOutputViz}
        sectionId="act-framework-output"
        ariaLabel="What the framework produces — the 2 × 2 trajectory output"
        vizAriaLabel="An empty 2-by-2 classification grid with four labelled quadrants: Concentrating, Escalating, Receding, Mitigating."
      />

      <ScrollySection
        steps={act2Steps}
        Viz={SortAssembly}
        sectionId="act-2"
        ariaLabel="Act 2: Building the monitoring question"
        vizAriaLabel="The SORT four-part monitoring question, filling in one box at a time."
        card={{ stageId: "mq" }}
      />

      <ScrollySection
        steps={tierReliabilitySteps}
        Viz={TierTable}
        sectionId="act-tier-reliability"
        ariaLabel="Classifying source reliability — the four estimation tiers"
        vizAriaLabel="A four-row table of source-reliability tiers; each row expands on click to describe the tier."
      />

      <ScrollySection
        steps={act3HarmSteps}
        Viz={EstimationPanels}
        sectionId="act-3-harm"
        ariaLabel="Act 3a: Estimating harm"
        vizAriaLabel="Harm-source panel: bounding the number of reported incidents."
        card={{ stageId: "harm" }}
      />

      <ScrollySection
        steps={act3ExposureSteps}
        Viz={EstimationPanels}
        sectionId="act-3-exposure"
        ariaLabel="Act 3b: Estimating exposure"
        vizAriaLabel="Exposure-source panel: scaling from proxy surveys to a population estimate."
        card={{ stageId: "exposure" }}
      />

      <ScrollySection
        steps={act4Steps}
        Viz={Act4Quadrant}
        sectionId="act-4"
        ariaLabel="Act 4: Classification for the chatbot case"
        vizAriaLabel="A two-by-two classification grid; the chatbot case lands in the escalating quadrant."
        card={{ stageId: "classification" }}
      />

      <PivotSection />

      <ScrollySection
        steps={act5Steps}
        Viz={Act5Quadrant}
        sectionId="act-5"
        ariaLabel="Act 5: Classification for the autonomous-vehicles case"
        vizAriaLabel="The same classification grid; the AV case lands in the mitigating quadrant, with the chatbot dot ghosted for reference."
      />

      <Closing />
    </main>
  );
}

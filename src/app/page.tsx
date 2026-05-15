import { Header } from "@/components/Header";
import { SectionDivider } from "@/components/SectionDivider";
import { PivotSection } from "@/components/PivotSection";
import { Closing } from "@/components/Closing";
import { NavArrows } from "@/components/NavArrows";
import { TuningPanel } from "@/components/TuningPanel";
import { ScrollySection, type StepDef } from "@/components/ScrollySection";
import { StepText } from "@/components/steps/StepText";
import { Em } from "@/components/Em";
import { Assumption } from "@/components/Assumption";
import { IncidentsChart } from "@/components/viz/IncidentsChart";
import { SortAssembly } from "@/components/viz/SortAssembly";
import { EstimationPanels } from "@/components/viz/EstimationPanels";
import { Act4Quadrant } from "@/components/viz/Act4Quadrant";
import { Act5Quadrant } from "@/components/viz/Act5Quadrant";

const act1Steps: StepDef[] = [
  {
    id: "1.1",
    element: (
      <StepText number="01" heading="Reports are climbing.">
        <p>
          The chart on the right is the most-cited evidence in current AI-risk
          discourse: monthly counts from the two major public incident databases,
          climbing year over year. By 2026 the curve looks alarming.
        </p>
        <p>
          But before reacting to the slope, ask what it is actually measuring.
        </p>
      </StepText>
    ),
  },
  {
    id: "1.2",
    element: (
      <StepText number="02" heading="A climbing line has three competing readings.">
        <p>
          The line might rise because AI is being deployed more widely, with each
          system functioning as it always did. It might rise because journalists
          and researchers have become better at noticing and reporting AI-related
          harms that were always happening. Or it might rise because each use of
          AI is now more likely to cause harm than it used to be.
        </p>
        <p>These three readings imply very different policy responses.</p>
      </StepText>
    ),
  },
  {
    id: "1.3",
    element: (
      <StepText number="03" heading="Separate harm from exposure.">
        <p>
          Slattery et al. (2026) propose a pipeline that refuses to pick between
          those three readings until <Em>exposure</Em> — how many people actually
          interact with the system — has been estimated separately from{" "}
          <Em>harm</Em>.
        </p>
        <p>
          The framework has four steps: define a precise monitoring question,
          estimate harm and exposure independently, take their ratio, and
          classify the resulting trajectory.
        </p>
      </StepText>
    ),
  },
];

const act2Steps: StepDef[] = [
  {
    id: "2.1",
    element: (
      <StepText number="04" heading="A monitoring question has four parts.">
        <p>
          SORT — <Em>Subject, Opportunity, Risk event, Timeframe</Em> — is the
          paper's structured analogue to PICO in evidence-based medicine. It
          forces analytical choices to be explicit rather than buried in framing.
        </p>
        <p>
          Each box on the right holds one piece of the question. They will fill
          in one at a time using the case study at the centre of this piece:
          conversational AI and self-harm.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.2",
    element: (
      <StepText number="05" heading="Subject: who or what is at risk.">
        <p>
          The subject is the population whose welfare is at stake — not the
          system causing the harm, but the people the harm reaches. Choose a
          population narrow enough to be measurable, broad enough to capture the
          phenomenon you actually care about.
        </p>
        <p>
          For this case: <Em>people living in the United States</Em>. The choice
          of country fixes the available denominators downstream — census,
          regulatory filings, survey instruments.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.3",
    element: (
      <StepText number="06" heading="Opportunity: what creates the exposure.">
        <p>
          Opportunity isolates the specific mechanism through which the subject
          is exposed to the harm. It is not "uses AI" — that would cast too wide
          a net. It is the precise interaction pattern that makes the risk event
          possible.
        </p>
        <p>
          Here: <Em>using conversational AI systems for emotional support</Em>.
          That tightens scope considerably and tightens the proxy choices we can
          use to estimate exposure later.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.4",
    element: (
      <StepText number="07" heading="Risk event: the specific harm.">
        <p>
          The risk event is the countable harm itself — phrased so an incident
          report can be matched against it. The paper specifies:{" "}
          <Em>
            receiving responses that encourage, or fail to discourage, suicidal
            ideation or self-harm
          </Em>
          .
        </p>
        <p>
          A vaguer phrasing — "AI causes mental health harms" — would inflate
          the number of partial matches and make the trend signal noisier.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.5",
    element: (
      <StepText number="08" heading="Timeframe: the unit of comparison.">
        <p>
          Timeframe defines the observation window. <Em>Per calendar year</Em>{" "}
          is the default chosen here because the underlying databases publish in
          year-resolution and trends are what the framework is trying to surface.
        </p>
      </StepText>
    ),
  },
  {
    id: "2.6",
    element: (
      <StepText number="09" heading="Assembled, the monitoring question reads:">
        <p>
          That single sentence is the unit of analysis. Everything downstream —
          which databases to search, which proxies to allow, what counts as a
          full match — flows from its exact phrasing.
        </p>
        <Assumption label="Why this matters">
          A monitoring question that is too narrow yields too few matches for a
          reliable trend. Too broad and the matches blur unrelated harms. The
          paper's interactive SORT tool exists to help analysts iterate toward
          questions that are both precise <em>and</em> answerable from available
          data.
        </Assumption>
      </StepText>
    ),
  },
];

const act3Steps: StepDef[] = [
  {
    id: "3.1",
    element: (
      <StepText number="10" heading="Harm, source one: the AI Incident Database.">
        <p>
          With no authoritative single source for this monitoring question, the
          procedure begins at <Em>Tier 2</Em> — combining proxy measures to
          construct bounds.
        </p>
        <p>
          An LLM-assisted scan of the AIID returns <Em>2 full matches in 2024</Em>{" "}
          and <Em>17 in 2025</Em>. Two matches in 2024 is below the threshold for
          a reliable signal, so this database alone cannot resolve the trend. A
          second source is needed.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.2",
    element: (
      <StepText number="11" heading="Source two: OECD AIM joins the lower bound.">
        <p>
          The OECD AI Incidents Monitor uses a different sourcing pipeline. After
          filtering for US-based incidents involving conversational AI resulting
          in physical or psychological injury, the LLM analysis yields{" "}
          <Em>8 full matches in 2024</Em> (harm count range 9–17) and{" "}
          <Em>55 in 2025</Em> with a harm count in the hundred-thousand range —
          an explosive increase in the implied severity.
        </p>
        <p>
          Two independent lower bounds, both directionally consistent. The trend
          claim begins to firm up.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.3",
    element: (
      <StepText number="12" heading="An upper bound from a single proxy.">
        <p>
          For an upper-bound estimate, the paper draws on OpenAI's own
          disclosure: approximately <Em>0.15% of weekly active users</Em> engage
          in conversations indicating potential suicidal planning or intent —
          more than one million people per week globally.
        </p>
        <p>
          That number is not a lower-bound match count. It is a ceiling derived
          from a proxy proportion. The visual treatment on the right shows the
          two kinds of evidence differently for that reason.
        </p>
        <Assumption label="Confidence tier — harm">
          Both bounds move in the same direction, but the AIID count for 2024
          falls below the three-match threshold and the OpenAI ceiling reflects
          global rather than US use. The trend claim is{" "}
          <em>increasing — Tier 2 · Low</em>. Expert elicitation or close
          monitoring of 2026 data would tighten this considerably.
        </Assumption>
      </StepText>
    ),
  },
  {
    id: "3.4",
    element: (
      <StepText number="13" heading="Exposure has no direct measurement.">
        <p>
          We rarely know how many people interact with a particular AI system,
          how many decisions are automated, or how many conversations take
          place. Exposure estimation typically relies on{" "}
          <Em>Tier 2 methods</Em> that combine multiple partial sources.
        </p>
        <p>
          For this case the paper proxies emotional-support use via Pew Research
          data on adjacent ChatGPT uses, then scales by an estimate of ChatGPT's
          share of the broader LLM market.
        </p>
      </StepText>
    ),
  },
  {
    id: "3.5",
    element: (
      <StepText number="14" heading="The Pew proxy, plus a scaling assumption.">
        <p>
          Pew Research data on ChatGPT use{" "}
          <Em>"to learn new things"</Em> and{" "}
          <Em>"for entertainment"</Em> by age group serves as the proxy frontier.
          The mid-point of those two shares becomes the point estimate; the
          shares are taken separately for the lower and upper bounds.
        </p>
        <p>
          To extend from ChatGPT to all conversational AI, the paper applies a
          market-share scalar: <Em>80%</Em> at the point estimate, <Em>90%</Em>{" "}
          and <Em>70%</Em> for the upper and lower bounds.
        </p>
        <Assumption label="Assumption stack — exposure">
          The Pew share answering "for entertainment" serves as the lower bound
          on emotional-support use; the share answering "to learn new things"
          serves as the upper bound; the mid-point of the two serves as the
          central estimate. These shares are then applied uniformly to the US
          census population in matching age groups, and scaled by an assumed
          ChatGPT market share of LLM personal use.
        </Assumption>
      </StepText>
    ),
  },
  {
    id: "3.6",
    element: (
      <StepText number="15" heading="Exposure: 64M in 2024, 88M in 2025.">
        <p>
          Combining the assumption stack with the Pew bucket data and the US
          census yields a central estimate of <Em>64 million</Em> people in 2024
          (plausible range 54–73M) and <Em>88 million</Em> in 2025 (75–99M).
          Order-of-magnitude estimate: 10⁸.
        </p>
        <p>
          The trend is <Em>increasing — approximately 40% year on year</Em>.
          Confidence tier 2 · Medium: the bounds are derived from reasonable
          sources, the assumptions are explicit, and the directional reading is
          robust to the moves used to construct them.
        </p>
      </StepText>
    ),
  },
];

const act4Steps: StepDef[] = [
  {
    id: "4.1",
    element: (
      <StepText number="14" heading="The simplest classification is a 2 × 2 grid.">
        <p>
          The grid on the right takes the exposure trend (E) and the
          harm-per-exposure trend (Ĥ) as its two axes, producing four
          governance-relevant categories:
        </p>
        <ul className="list-none space-y-1 mt-2 text-[15px]">
          <li>
            <Em>Escalating</Em> — both Ĥ and E are increasing. Urgent attention.
          </li>
          <li>
            <Em>Mitigating</Em> — Ĥ is decreasing while E is increasing.
            Continue monitoring.
          </li>
          <li>
            <Em>Concentrating</Em> — Ĥ is increasing while E is decreasing.
            Targeted measures.
          </li>
          <li>
            <Em>Receding</Em> — neither dimension is worsening. Continue
            strategy.
          </li>
        </ul>
      </StepText>
    ),
  },
  {
    id: "4.2",
    element: (
      <StepText number="15" heading="The chatbot case lands in the top-right.">
        <p>
          The OECD AIM signal grew sharply between 2024 and 2025, while exposure
          grew by approximately 40%. Harm rose faster than exposure — so
          harm-per-exposure is <Em>increasing</Em> against a rising exposure
          base.
        </p>
        <p>
          Both arrows point up. The dot sits in the escalating quadrant.
        </p>
      </StepText>
    ),
  },
  {
    id: "4.3",
    element: (
      <StepText number="16" heading="Verdict: Escalating.">
        <p>
          Both the population at risk and the harm per unit exposure are
          growing. The framework's recommendation: <Em>urgent attention</Em> —
          expanded monitoring, active investigation into causal drivers, and
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
          NHTSA's mandatory reporting puts the procedure at <Em>Tier 1</Em> for
          harm: ADS incidents rose from <Em>526 in 2024</Em> to <Em>975 in 2025</Em>,
          an 85.4% increase — primarily driven by property-damage cases.
        </p>
        <p>
          A headline that, by itself, would suggest the framework's most urgent
          classification. The chatbot dot from the previous section is ghosted
          for comparison.
        </p>
      </StepText>
    ),
  },
  {
    id: "5.2",
    element: (
      <StepText number="17" heading="But exposure doubled in the same period.">
        <p>
          The Autonomous Vehicle Industry Association reports 145M miles driven
          on US public roads from June 2024 to May 2025, compared to 75M the
          previous year — roughly a doubling. Waymo's paid-ride velocity grew
          80% in eight months in 2025.
        </p>
        <p>
          The point estimate puts AV miles at <Em>78M in 2024</Em> and{" "}
          <Em>156M in 2025</Em>. Exposure grew approximately 100%.
        </p>
        <Assumption label="Exposure assumption stack — AV">
          The point estimate uses the AVIA anchor and assumes the monthly
          growth rate implied by Waymo's 2025 trajectory. The lower bound uses
          AVIA's May 2024 and May 2025 totals as whole-year proxies. The upper
          bound increases the point estimate by 10%.
        </Assumption>
      </StepText>
    ),
  },
  {
    id: "5.3",
    element: (
      <StepText number="18" heading="Verdict: Mitigating.">
        <p>
          Exposure growth (≈100%) outpaces harm growth (≈85%), yielding a{" "}
          <Em>decreasing</Em> harm-per-exposure trend against rising exposure.
          Fewer incidents occur per million vehicle-miles than the year before.
        </p>
        <p>
          Same procedure. Comparable headline counts. Opposite governance
          implication. The framework's value is that it makes the second number
          — the exposure denominator — visible enough to change the verdict.
        </p>
      </StepText>
    ),
  },
];

export default function Page() {
  return (
    <main className="relative z-10">
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

      <SectionDivider />

      <ScrollySection
        steps={act2Steps}
        Viz={SortAssembly}
        sectionId="act-2"
        ariaLabel="Act 2: Building the monitoring question"
        vizAriaLabel="The SORT four-part monitoring question, filling in one box at a time."
      />

      <SectionDivider />

      <ScrollySection
        steps={act3Steps}
        Viz={EstimationPanels}
        sectionId="act-3"
        ariaLabel="Act 3: Estimating harm and exposure trends"
        vizAriaLabel="Side-by-side panels showing the construction of harm and exposure estimates."
      />

      <SectionDivider />

      <ScrollySection
        steps={act4Steps}
        Viz={Act4Quadrant}
        sectionId="act-4"
        ariaLabel="Act 4: Classification for the chatbot case"
        vizAriaLabel="A two-by-two classification grid; the chatbot case lands in the escalating quadrant."
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

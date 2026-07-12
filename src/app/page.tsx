"use client";

import { useRef, useState, type ComponentType } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header } from "@/components/Header";
import { Closing } from "@/components/Closing";
import { NavArrows } from "@/components/NavArrows";
import { ProgressRail } from "@/components/ProgressRail";
import { ScrollySection, type CardSpec, type StepDef } from "@/components/ScrollySection";
import { IncidentsChart } from "@/components/viz/IncidentsChart";
import { SortAssembly } from "@/components/viz/SortAssembly";
import { HarmPanel } from "@/components/viz/estimation/HarmPanel";
import { ExposurePanel } from "@/components/viz/estimation/ExposurePanel";
import { Act4Quadrant } from "@/components/viz/Act4Quadrant";
import { ProgressStepper } from "@/components/ProgressStepper";
import { STAGES, type StageId } from "@/lib/stages";
import { act1Steps } from "@/content/act1-steps";
import { act2Steps } from "@/content/act2-steps";
import { harmSteps } from "@/content/harm-steps";
import { exposureSteps } from "@/content/exposure-steps";
import { classificationSteps } from "@/content/classification-steps";
import type { ContentStep } from "@/content/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SectionSpec = {
  sectionId: string;
  contentSteps: ContentStep[];
  Viz: ComponentType<{ activeStep: string | null }>;
  ariaLabel: string;
  vizAriaLabel: string;
  card?: CardSpec;
  figureCaption?: string;
};

const SECTION_SPECS: SectionSpec[] = [
  {
    sectionId: "act-1",
    contentSteps: act1Steps,
    Viz: IncidentsChart,
    ariaLabel: "Act 1: The problem with raw incident counts",
    vizAriaLabel:
      "A monthly incidents-and-hazards chart from late 2020 to late 2025, climbing year over year.",
    figureCaption:
      "Monthly AI incidents and hazards recorded in the OECD AI Incidents and Hazards Monitor, December 2020 – December 2025. Hover a bar for exact counts.",
  },
  {
    sectionId: "act-2",
    contentSteps: act2Steps,
    Viz: SortAssembly,
    ariaLabel: "Act 2: Building the monitoring question",
    vizAriaLabel: "The SORT four-part monitoring question, filling in one box at a time.",
    card: { stageId: "mq" },
    figureCaption:
      "The SORT monitoring question for conversational AI and self-harm, assembled one part at a time.",
  },
  {
    sectionId: "act-3-harm",
    contentSteps: harmSteps,
    Viz: HarmPanel,
    ariaLabel: "Act 3a: Estimating harm",
    vizAriaLabel:
      "Harm panel: a point estimate from OpenAI's disclosed response ratios, then an incident-database check on its lower uncertainty band.",
    card: { stageId: "estimation" },
    figureCaption:
      "Estimating harm: a point estimate from disclosed response ratios, checked against recorded incident counts.",
  },
  {
    sectionId: "act-3-exposure",
    contentSteps: exposureSteps,
    Viz: ExposurePanel,
    ariaLabel: "Act 3b: Estimating exposure",
    vizAriaLabel:
      "Exposure panel: a funnel of usage proxies scaling to a conversation-count estimate.",
    card: { stageId: "estimation" },
    figureCaption:
      "Estimating exposure: conversations matching the opportunity, assembled from a funnel of usage proxies.",
  },
  {
    sectionId: "act-4",
    contentSteps: classificationSteps,
    Viz: Act4Quadrant,
    ariaLabel: "Act 4: Classification for the chatbot case",
    vizAriaLabel:
      "A two-by-two classification grid; the chatbot case lands in the mitigating quadrant, with the classifier's distribution weights on the placement.",
    card: { stageId: "classification" },
    figureCaption:
      "Trajectory classification for the chatbot case, with the probabilistic classifier's weights.",
  },
];

// Display numbers ("01", "02", …) are assigned from a single running counter
// so inserting or removing a step never desyncs the numbering. Figure
// numbers likewise derive from section order.
let stepCounter = 0;
const SECTIONS = SECTION_SPECS.map((spec, sectionIndex) => ({
  ...spec,
  figure: spec.figureCaption ? { n: sectionIndex + 1, caption: spec.figureCaption } : undefined,
  steps: spec.contentSteps.map(
    (step): StepDef => ({
      id: step.id,
      element: step.render(String(++stepCounter).padStart(2, "0")),
    }),
  ),
}));

// Every sectionId a stage claims must exist, or its ScrollTrigger silently
// never fires. Fail loudly instead.
{
  const known = new Set(SECTION_SPECS.map((s) => s.sectionId));
  for (const stage of STAGES) {
    for (const id of stage.sectionIds) {
      if (!known.has(id)) {
        throw new Error(`Stage "${stage.id}" references unknown section "${id}"`);
      }
    }
  }
}

export default function Page() {
  const mainRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState<StageId | null>(null);

  // One ScrollTrigger per (stage, section) pair. Each sets the active stage
  // when its section's top crosses 60% from viewport top (scrolling down or
  // up). The very first and very last covered sections additionally clear the
  // active state when scrolling out of the framework on either end.
  useGSAP(
    () => {
      const triggers = STAGES.flatMap((stage, stageIndex) =>
        stage.sectionIds.map((sectionId, sectionIndex) => {
          const isFirst = stageIndex === 0 && sectionIndex === 0;
          const isLast =
            stageIndex === STAGES.length - 1 && sectionIndex === stage.sectionIds.length - 1;
          return ScrollTrigger.create({
            trigger: `#${sectionId}`,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActiveStage(stage.id),
            onEnterBack: () => setActiveStage(stage.id),
            onLeaveBack: isFirst ? () => setActiveStage(null) : undefined,
            onLeave: isLast ? () => setActiveStage(null) : undefined,
          });
        }),
      );

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: mainRef },
  );

  return (
    <main ref={mainRef} className="relative z-10">
      <ProgressStepper activeStage={activeStage} />
      <ProgressRail />
      <NavArrows />
      <Header />

      {SECTIONS.map(({ sectionId, steps, Viz, ariaLabel, vizAriaLabel, card, figure }) => (
        <ScrollySection
          key={sectionId}
          steps={steps}
          Viz={Viz}
          sectionId={sectionId}
          ariaLabel={ariaLabel}
          vizAriaLabel={vizAriaLabel}
          card={card}
          figure={figure}
        />
      ))}

      <Closing />
    </main>
  );
}

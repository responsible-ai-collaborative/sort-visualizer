// Shared stage metadata for the four framework stages.
// Used by the stage card, ProgressStepper, and the page-level scroll tracking.

export type StageId = "mq" | "estimation" | "classification";

export type Stage = {
  id: StageId;
  short: string; // e.g. "Monitoring question"
  long: string; // e.g. "Building the monitoring question"
  sub: string; // e.g. "SORT framework"
  detail: string; // one-sentence description for the framework-flow viz
  // ScrollySection `sectionId`s covered by this stage, in page order. The
  // page creates one ScrollTrigger per entry so multi-section stages stay
  // attributed correctly.
  sectionIds: readonly string[];
};

export const STAGES: readonly Stage[] = [
  {
    id: "mq",
    short: "Monitoring question",
    long: "Monitoring question",
    sub: "SORT framework",
    detail:
      "Pin the harm being studied — who or what is at risk, through what mechanism, over what period.",
    sectionIds: ["act-2"],
  },
  {
    id: "estimation",
    short: "Estimation",
    long: "Estimation",
    sub: "Harm & exposure",
    detail:
      "Estimate harm and exposure independently across two periods — each built up from proxy measures, checked against incident data, and scored by a confidence tier.",
    sectionIds: ["act-3-harm", "act-3-exposure"],
  },
  {
    id: "classification",
    short: "Classification",
    long: "Classification",
    sub: "Trajectory + uncertainty",
    detail:
      "Compare the harm and exposure trends to land in one of four governance quadrants — carrying the uncertainty through as a distribution.",
    sectionIds: ["act-4"],
  },
] as const;

export function getStage(id: StageId): Stage {
  const s = STAGES.find((stage) => stage.id === id);
  if (!s) throw new Error(`Unknown stage id: ${id}`);
  return s;
}

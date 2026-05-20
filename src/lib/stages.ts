// Shared stage metadata for the four framework stages.
// Used by ChapterCard, ProgressStepper, and the page-level scroll tracking.

export type StageId = "mq" | "harm" | "exposure" | "classification";

export type Stage = {
  id: StageId;
  number: 1 | 2 | 3 | 4;
  short: string; // e.g. "Monitoring question"
  long: string; // e.g. "Building the monitoring question"
  sub: string; // e.g. "SORT framework"
  detail: string; // one-sentence description for the framework-flow viz
  sectionId: string; // matches the ScrollySection's `sectionId`
};

export const STAGES: readonly Stage[] = [
  {
    id: "mq",
    number: 1,
    short: "Monitoring question",
    long: "Monitoring question",
    sub: "SORT framework",
    detail:
      "Pin the harm being studied — who is at risk, through what mechanism, over what period.",
    sectionId: "act-2",
  },
  {
    id: "harm",
    number: 2,
    short: "Harm",
    long: "Harm",
    sub: "Recorded incidents",
    detail:
      "Count reported incidents across multiple databases, scored by a confidence tier.",
    sectionId: "act-3-harm",
  },
  {
    id: "exposure",
    number: 3,
    short: "Exposure",
    long: "Exposure",
    sub: "Estimation procedure",
    detail:
      "Estimate the population at risk by chaining proxy surveys with a market-share scalar.",
    sectionId: "act-3-exposure",
  },
  {
    id: "classification",
    number: 4,
    short: "Classification",
    long: "Classification",
    sub: "2 × 2 trajectory",
    detail:
      "Compare harm and exposure trends to land in one of four governance quadrants.",
    sectionId: "act-4",
  },
] as const;

export function getStage(id: StageId): Stage {
  const s = STAGES.find((stage) => stage.id === id);
  if (!s) throw new Error(`Unknown stage id: ${id}`);
  return s;
}

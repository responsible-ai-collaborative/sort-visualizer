// Shared stage metadata for the four framework stages.
// Used by the stage card, ProgressStepper, and the page-level scroll tracking.

export type StageId = "mq" | "harm" | "exposure" | "classification";

export type Stage = {
  id: StageId;
  short: string; // e.g. "Monitoring question"
  long: string; // e.g. "Building the monitoring question"
  sub: string; // e.g. "SORT framework"
  detail: string; // one-sentence description for the framework-flow viz
  // ScrollySection `sectionId`s covered by this stage, in page order. The
  // page creates one ScrollTrigger per entry so interstitial sections (e.g.
  // the tier table) stay attributed to the right stage.
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
    id: "harm",
    short: "Harm",
    long: "Harm",
    sub: "Recorded incidents",
    detail:
      "Bound harm with incident databases, then construct a point estimate from proxy measures, scored by a confidence tier.",
    sectionIds: ["act-tier-reliability", "act-3-harm"],
  },
  {
    id: "exposure",
    short: "Exposure",
    long: "Exposure",
    sub: "Estimation procedure",
    detail:
      "Estimate the opportunity for harm by chaining usage disclosures, traffic shares, and disclosed rates.",
    sectionIds: ["act-3-exposure"],
  },
  {
    id: "classification",
    short: "Classification",
    long: "Classification",
    sub: "Trajectory + weights",
    detail:
      "Compare harm and exposure trends to land in one of four governance quadrants — with a probability on the placement.",
    sectionIds: ["act-4"],
  },
] as const;

export function getStage(id: StageId): Stage {
  const s = STAGES.find((stage) => stage.id === id);
  if (!s) throw new Error(`Unknown stage id: ${id}`);
  return s;
}

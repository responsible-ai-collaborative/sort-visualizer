// Quadrant + trajectory copy. Source: paper §2.2 (trajectories) and §2.3 /
// Appendix E (Unclassifiable).

import type { Quadrant } from "./case-data";

export type QuadrantCopy = {
  label: string;
  description: string;
  summary: string;
  trends: { h: string; e: string };
};

export const quadrantCopy: Record<Quadrant, QuadrantCopy> = {
  escalating: {
    label: "Escalating",
    description: "Urgent attention",
    summary:
      "Both the population at risk and the harm per unit exposure are growing. Demands urgent response: expanded monitoring, active investigation, possibly regulatory intervention.",
    trends: { h: "Ĥ ↑", e: "E ↑" },
  },
  mitigating: {
    label: "Mitigating",
    description: "Monitor closely",
    summary:
      "More people are exposed, but harm per unit exposure is decreasing — existing safeguards appear to be working. Continued monitoring warranted; a failure of current controls could shift the trajectory to escalating.",
    trends: { h: "Ĥ ↓", e: "E ↑" },
  },
  concentrating: {
    label: "Concentrating",
    description: "Targeted measures",
    summary:
      "Fewer people are exposed, but those who face exposure face worse outcomes. Calls for targeted protective measures and investigation into why harm is intensifying.",
    trends: { h: "Ĥ ↑", e: "E ↓" },
  },
  receding: {
    label: "Receding",
    description: "Continue strategy",
    summary:
      "Neither dimension is worsening. Additional intervention may not be required; where specific measures preceded this trajectory, maintaining or extending them to related domains may be worthwhile.",
    trends: { h: "Ĥ ↓", e: "E ↓" },
  },
};

// The fifth outcome of the probabilistic classifier: draws where one or both
// trends fall inside the indifference band and cannot be placed on the grid.
export const unclassifiableCopy = {
  label: "Unclassifiable",
  description: "Principled abstention",
  summary:
    "One or both trends cannot be determined with enough certainty to place the question on the grid. A valid finding in its own right: current evidence cannot support even a directional estimate.",
};

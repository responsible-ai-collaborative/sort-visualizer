// Step ids and per-act state snapshots. Each viz consumes the snapshot at the
// active step. Display numbers are assigned by a single counter in page.tsx;
// internal ids run "1.1" .. "4.3" for readability, with "fo.1" (framework
// output) and "tr.1" (tier reliability) for the two non-act framework reveals.

import type { Quadrant } from "./case-data";

// ── Act 1: The problem ─────────────────────────────────────────────────────
export type Act1StepId = "1.1" | "1.2" | "1.3";

export type Act1State = {
  chart: boolean;
  annotations: boolean;
  pipeline: boolean;
};

export const act1Snapshots: Record<Act1StepId, Act1State> = {
  "1.1": { chart: true, annotations: false, pipeline: false },
  "1.2": { chart: true, annotations: true, pipeline: false },
  "1.3": { chart: true, annotations: true, pipeline: true },
};

export const act1Initial: Act1State = { chart: false, annotations: false, pipeline: false };

// ── Act 2: Building the monitoring question ────────────────────────────────
export type Act2StepId = "2.1" | "2.2" | "2.3" | "2.4" | "2.5" | "2.6";

export type Act2State = {
  boxes: boolean;
  contents: { S: boolean; O: boolean; R: boolean; T: boolean };
  sentence: boolean;
};

export const act2Snapshots: Record<Act2StepId, Act2State> = {
  "2.1": {
    boxes: true,
    contents: { S: false, O: false, R: false, T: false },
    sentence: false,
  },
  "2.2": {
    boxes: true,
    contents: { S: true, O: false, R: false, T: false },
    sentence: false,
  },
  "2.3": {
    boxes: true,
    contents: { S: true, O: true, R: false, T: false },
    sentence: false,
  },
  "2.4": {
    boxes: true,
    contents: { S: true, O: true, R: true, T: false },
    sentence: false,
  },
  "2.5": {
    boxes: true,
    contents: { S: true, O: true, R: true, T: true },
    sentence: false,
  },
  "2.6": {
    boxes: false,
    contents: { S: true, O: true, R: true, T: true },
    sentence: true,
  },
};

export const act2Initial: Act2State = {
  boxes: false,
  contents: { S: false, O: false, R: false, T: false },
  sentence: false,
};

// ── Act 3a: Estimating harm (steps 3.1–3.4) ────────────────────────────────
export type HarmStepId = "3.1" | "3.2" | "3.3" | "3.4";

export type HarmState = {
  aiid: boolean;
  oecd: boolean;
  pointEstimate: boolean;
  conclusion: boolean;
};

export const harmSnapshots: Record<HarmStepId, HarmState> = {
  "3.1": { aiid: true, oecd: false, pointEstimate: false, conclusion: false },
  "3.2": { aiid: true, oecd: true, pointEstimate: false, conclusion: false },
  "3.3": { aiid: true, oecd: true, pointEstimate: true, conclusion: false },
  "3.4": { aiid: true, oecd: true, pointEstimate: true, conclusion: true },
};

export const harmInitial: HarmState = {
  aiid: false,
  oecd: false,
  pointEstimate: false,
  conclusion: false,
};

// ── Act 3b: Estimating exposure (steps 3.5–3.6) ────────────────────────────
export type ExposureStepId = "3.5" | "3.6";

export type ExposureState = {
  funnel: boolean;
  rate: boolean; // the ×0.15% row + final estimate
  conclusion: boolean;
};

export const exposureSnapshots: Record<ExposureStepId, ExposureState> = {
  "3.5": { funnel: true, rate: false, conclusion: false },
  "3.6": { funnel: true, rate: true, conclusion: true },
};

export const exposureInitial: ExposureState = {
  funnel: false,
  rate: false,
  conclusion: false,
};

// ── Act 4: Classification ──────────────────────────────────────────────────
// Three steps: dot placement, probabilistic weights, then verdict. The
// empty-quadrant beat lives upstream in the framework-output reveal.
export type Act4StepId = "4.1" | "4.2" | "4.3";

export type Act4State = {
  grid: boolean;
  activeQuadrant: Quadrant | null;
  dot: boolean;
  weights: boolean;
  verdict: boolean;
};

export const act4Snapshots: Record<Act4StepId, Act4State> = {
  "4.1": {
    grid: true,
    activeQuadrant: "mitigating",
    dot: true,
    weights: false,
    verdict: false,
  },
  "4.2": {
    grid: true,
    activeQuadrant: "mitigating",
    dot: true,
    weights: true,
    verdict: false,
  },
  "4.3": {
    grid: true,
    activeQuadrant: "mitigating",
    dot: true,
    weights: true,
    verdict: true,
  },
};

export const act4Initial: Act4State = {
  grid: false,
  activeQuadrant: null,
  dot: false,
  weights: false,
  verdict: false,
};

// ── Helpers ────────────────────────────────────────────────────────────────

export function resolveAct1(activeStep: string | null): Act1State {
  if (!activeStep || !(activeStep in act1Snapshots)) return act1Initial;
  return act1Snapshots[activeStep as Act1StepId];
}

export function resolveAct2(activeStep: string | null): Act2State {
  if (!activeStep || !(activeStep in act2Snapshots)) return act2Initial;
  return act2Snapshots[activeStep as Act2StepId];
}

export function resolveHarm(activeStep: string | null): HarmState {
  if (!activeStep || !(activeStep in harmSnapshots)) return harmInitial;
  return harmSnapshots[activeStep as HarmStepId];
}

export function resolveExposure(activeStep: string | null): ExposureState {
  if (!activeStep || !(activeStep in exposureSnapshots)) return exposureInitial;
  return exposureSnapshots[activeStep as ExposureStepId];
}

export function resolveAct4(activeStep: string | null): Act4State {
  if (!activeStep || !(activeStep in act4Snapshots)) return act4Initial;
  return act4Snapshots[activeStep as Act4StepId];
}

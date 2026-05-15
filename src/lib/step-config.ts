// Step ids and per-act state snapshots. Each viz consumes the snapshot at the
// active step. Display numbers run 01–21 across all acts; internal ids run
// "1.1" .. "5.3" for readability.

export type GlobalStepNumber =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21";

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

// ── Act 3: Estimating harm and exposure ────────────────────────────────────
export type Act3StepId = "3.1" | "3.2" | "3.3" | "3.4" | "3.5" | "3.6";

export type Act3State = {
  focus: "harm" | "exposure";
  harm: {
    aiid: boolean;
    oecd: boolean;
    openai: boolean;
    conclusion: boolean;
  };
  exposure: {
    intro: boolean;
    pew: boolean;
    marketShare: boolean;
    conclusion: boolean;
  };
};

export const act3Snapshots: Record<Act3StepId, Act3State> = {
  "3.1": {
    focus: "harm",
    harm: { aiid: true, oecd: false, openai: false, conclusion: false },
    exposure: { intro: false, pew: false, marketShare: false, conclusion: false },
  },
  "3.2": {
    focus: "harm",
    harm: { aiid: true, oecd: true, openai: false, conclusion: false },
    exposure: { intro: false, pew: false, marketShare: false, conclusion: false },
  },
  "3.3": {
    focus: "harm",
    harm: { aiid: true, oecd: true, openai: true, conclusion: true },
    exposure: { intro: false, pew: false, marketShare: false, conclusion: false },
  },
  "3.4": {
    focus: "exposure",
    harm: { aiid: true, oecd: true, openai: true, conclusion: true },
    exposure: { intro: true, pew: false, marketShare: false, conclusion: false },
  },
  "3.5": {
    focus: "exposure",
    harm: { aiid: true, oecd: true, openai: true, conclusion: true },
    exposure: { intro: true, pew: true, marketShare: true, conclusion: false },
  },
  "3.6": {
    focus: "exposure",
    harm: { aiid: true, oecd: true, openai: true, conclusion: true },
    exposure: { intro: true, pew: true, marketShare: true, conclusion: true },
  },
};

export const act3Initial: Act3State = {
  focus: "harm",
  harm: { aiid: false, oecd: false, openai: false, conclusion: false },
  exposure: { intro: false, pew: false, marketShare: false, conclusion: false },
};

// ── Act 4: Classification (chatbot) ────────────────────────────────────────
export type Act4StepId = "4.1" | "4.2" | "4.3";

export type Act4State = {
  grid: boolean;
  activeQuadrant: "escalating" | null;
  dot: boolean;
  verdict: boolean;
};

export const act4Snapshots: Record<Act4StepId, Act4State> = {
  "4.1": { grid: true, activeQuadrant: null, dot: false, verdict: false },
  "4.2": { grid: true, activeQuadrant: "escalating", dot: true, verdict: false },
  "4.3": { grid: true, activeQuadrant: "escalating", dot: true, verdict: true },
};

export const act4Initial: Act4State = {
  grid: false,
  activeQuadrant: null,
  dot: false,
  verdict: false,
};

// ── Act 5: AV contrast ─────────────────────────────────────────────────────
export type Act5StepId = "5.1" | "5.2" | "5.3";

export type Act5State = {
  grid: boolean;
  ghost: boolean; // chatbot dot ghosted
  activeQuadrant: "mitigating" | null;
  dot: boolean;
  verdict: boolean;
};

export const act5Snapshots: Record<Act5StepId, Act5State> = {
  "5.1": { grid: true, ghost: true, activeQuadrant: null, dot: false, verdict: false },
  "5.2": { grid: true, ghost: true, activeQuadrant: null, dot: false, verdict: false },
  "5.3": { grid: true, ghost: true, activeQuadrant: "mitigating", dot: true, verdict: true },
};

export const act5Initial: Act5State = {
  grid: false,
  ghost: false,
  activeQuadrant: null,
  dot: false,
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

export function resolveAct3(activeStep: string | null): Act3State {
  if (!activeStep || !(activeStep in act3Snapshots)) return act3Initial;
  return act3Snapshots[activeStep as Act3StepId];
}

export function resolveAct4(activeStep: string | null): Act4State {
  if (!activeStep || !(activeStep in act4Snapshots)) return act4Initial;
  return act4Snapshots[activeStep as Act4StepId];
}

export function resolveAct5(activeStep: string | null): Act5State {
  if (!activeStep || !(activeStep in act5Snapshots)) return act5Initial;
  return act5Snapshots[activeStep as Act5StepId];
}

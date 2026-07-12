// Probabilistic trajectory classifier — a faithful TypeScript port of the
// paper's Algorithm 2 (Appendix E). Each of the four quantities H1, H2, E1,
// E2 is log-normal with median at the point estimate and central 95%
// interval [X/u, uX] (sigma = ln(u)/1.96); harm draws are conditioned on the
// incident-database floors. Trends: dE = ln(E2/E1), dH-hat = ln(H2/H1) - dE.
// A draw with either trend inside the indifference band eps is
// Unclassifiable; otherwise the signs pick the quadrant. Raw quadrant
// frequencies are then rescaled by the directional-confidence mass
// pi = cE * cH (Eq. 3-4).
//
// With the paper's inputs (u_H=2, u_E=1.5, eps=0.05) this reproduces the
// published weights — Mitigating 58.6 / Unclassifiable 31.6 / Escalating
// 9.8 — within Monte Carlo noise (verified 2026-07-06).

import type { ClassificationWeights, TrajectoryCategory } from "@/lib/case-data";

export type ClassifierParams = {
  h1: number;
  h2: number;
  e1: number;
  e2: number;
  /** Uncertainty factor on both harm estimates (u >= 1). */
  uH: number;
  /** Uncertainty factor on both exposure estimates (u >= 1). */
  uE: number;
  /** Indifference band on |dE| and |dH-hat|, in log units (~= fraction). */
  eps: number;
  /** AIID recorded counts — truncate the harm draws' lower band from below. */
  floorH1?: number;
  floorH2?: number;
  draws?: number;
  seed?: number;
  /** How many draws to surface for the scatter cloud. */
  cloudSize?: number;
};

export type CloudDraw = { dE: number; dH: number; category: TrajectoryCategory };

export type ClassifierResult = {
  weights: ClassificationWeights;
  cloud: CloudDraw[];
};

// Deterministic PRNG so identical inputs render identical weights/clouds —
// the UI must not flicker between renders.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNormal(rng: () => number): () => number {
  // Box-Muller with a cached spare.
  let spare: number | null = null;
  return () => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u1 = 0;
    while (u1 === 0) u1 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * rng();
    spare = r * Math.sin(theta);
    return r * Math.cos(theta);
  };
}

// Log-normal draw conditioned on X >= floor (rejection with a bounded loop;
// the paper's floors sit orders of magnitude below the medians, so the loop
// virtually never rejects — the fallback pins pathological cases at the
// floor rather than spinning).
function drawLogNormal(
  normal: () => number,
  median: number,
  sigma: number,
  floor: number | undefined,
): number {
  if (sigma === 0) {
    const v = median;
    return floor !== undefined ? Math.max(v, floor) : v;
  }
  const a = floor !== undefined ? (Math.log(floor) - Math.log(median)) / sigma : -Infinity;
  for (let i = 0; i < 60; i++) {
    const z = normal();
    if (z >= a) return median * Math.exp(sigma * z);
  }
  return median * Math.exp(sigma * a);
}

function categorize(dE: number, dH: number, eps: number): TrajectoryCategory {
  if (Math.abs(dE) <= eps || Math.abs(dH) <= eps) return "unclassifiable";
  if (dE > 0) return dH > 0 ? "escalating" : "mitigating";
  return dH > 0 ? "concentrating" : "receding";
}

export function classify(params: ClassifierParams): ClassifierResult {
  const {
    h1,
    h2,
    e1,
    e2,
    uH,
    uE,
    eps,
    floorH1,
    floorH2,
    draws = 20_000,
    seed = 0x50_52_54, // arbitrary fixed seed ("SRT")
    cloudSize = 260,
  } = params;

  const sigmaH = Math.log(Math.max(1, uH)) / 1.96;
  const sigmaE = Math.log(Math.max(1, uE)) / 1.96;
  const normal = makeNormal(mulberry32(seed));

  const counts: Record<TrajectoryCategory, number> = {
    escalating: 0,
    mitigating: 0,
    concentrating: 0,
    receding: 0,
    unclassifiable: 0,
  };
  let upE = 0;
  let dnE = 0;
  let upH = 0;
  let dnH = 0;
  const cloud: CloudDraw[] = [];

  for (let k = 0; k < draws; k++) {
    const H1 = drawLogNormal(normal, h1, sigmaH, floorH1);
    const H2 = drawLogNormal(normal, h2, sigmaH, floorH2);
    const E1 = drawLogNormal(normal, e1, sigmaE, undefined);
    const E2 = drawLogNormal(normal, e2, sigmaE, undefined);

    const dE = Math.log(E2 / E1);
    const dH = Math.log(H2 / H1) - dE;

    const category = categorize(dE, dH, eps);
    counts[category]++;
    if (dE > eps) upE++;
    else if (dE < -eps) dnE++;
    if (dH > eps) upH++;
    else if (dH < -eps) dnH++;

    if (cloud.length < cloudSize) cloud.push({ dE, dH, category });
  }

  // Directional-confidence adjustment (Appendix E, Eq. 3-4).
  const cE = Math.abs(upE - dnE) / draws;
  const cH = Math.abs(upH - dnH) / draws;
  const pi = cE * cH;
  const quadTotal = counts.escalating + counts.mitigating + counts.concentrating + counts.receding;

  const adjusted = (c: Exclude<TrajectoryCategory, "unclassifiable">) =>
    quadTotal > 0 ? (pi * counts[c]) / quadTotal : 0;

  const weights: ClassificationWeights = {
    escalating: adjusted("escalating"),
    mitigating: adjusted("mitigating"),
    concentrating: adjusted("concentrating"),
    receding: adjusted("receding"),
    unclassifiable: 1 - pi,
  };

  return { weights, cloud };
}

// All numbers, sources, and assumptions are drawn from the paper,
// "A Pragmatic Classification Framework for AI Incident Monitoring." Sections
// referenced inline. The paper PDF is the source of truth — this file mirrors
// it but does not paraphrase the assumption stacks.

export type Quadrant = "escalating" | "mitigating" | "receding" | "concentrating";
export type Trend = "increasing" | "decreasing" | "stable" | "indeterminate";
export type ConfidenceLabel = "High" | "Medium" | "Low";

export type SparkPoint = { year: string; value: number };

export type HarmSource = {
  kind: "count" | "ceiling";
  tag: string; // e.g. "AIID", "OECD AIM", "OPENAI", "NHTSA"
  name: string;
  blurb: string;
  // For "count" sources: year-on-year match counts that serve as lower bounds.
  values?: SparkPoint[];
  // For "ceiling" sources: a single upper-bound number with a label.
  ceiling?: { display: string; note: string };
  note?: string;
};

export type ExposureSource = {
  tag: string;
  name: string;
  blurb: string;
  // Bars or numbers attached to the source; structure varies by case.
  detail: string;
};

export type ExposureEstimate = {
  year: string;
  central: number; // in raw units (people, vehicle-miles)
  range: [number, number];
  display: string; // formatted, e.g. "64M (54–73M)"
};

export type CaseStudy = {
  id: "chatbot" | "av";
  label: string;
  shortLabel: string;
  mq: {
    subject: string;
    opportunity: string;
    riskEvent: string;
    timeframe: string;
  };
  harm: {
    sources: HarmSource[];
    trend: Trend;
    confidenceTier: 1 | 2 | 3;
    confidenceLabel: ConfidenceLabel;
    summary: string;
  };
  exposure: {
    sources: ExposureSource[];
    assumptions: string[];
    estimates: ExposureEstimate[];
    trend: Trend;
    confidenceTier: 1 | 2 | 3;
    confidenceLabel: ConfidenceLabel;
    summary: string;
  };
  classification: Quadrant;
  verdict: string;
};

// ── Case 1: Conversational AI and self-harm ─────────────────────────────────
// Source: paper §3.1.

export const chatbotCase: CaseStudy = {
  id: "chatbot",
  label: "Conversational AI and self-harm",
  shortLabel: "Chatbot",
  mq: {
    subject: "people living in the United States",
    opportunity: "who use conversational AI systems for emotional support",
    riskEvent:
      "receive responses that encourage, or fail to discourage, suicidal ideation or self-harm",
    timeframe: "per calendar year",
  },
  harm: {
    sources: [
      {
        kind: "count",
        tag: "AIID",
        name: "AI Incident Database",
        blurb:
          "LLM analysis of the AIID found 2 full matches in 2024 and 17 in 2025. Two matches is below the threshold for a reliable signal, so a second database is needed.",
        values: [
          { year: "2024", value: 2 },
          { year: "2025", value: 17 },
        ],
      },
      {
        kind: "count",
        tag: "OECD AIM",
        name: "OECD AI Incidents Monitor",
        blurb:
          "After filtering for US-based incidents involving conversational AI resulting in physical or psychological injury, OECD AIM yields 8 full matches in 2024 (harm count 9–17) and 55 full matches in 2025 (harm count in the 100k range — an explosive increase).",
        values: [
          { year: "2024", value: 8 },
          { year: "2025", value: 55 },
        ],
        note: "Harm count range 9–17 (2024); ~100k range (2025).",
      },
      {
        kind: "ceiling",
        tag: "OPENAI",
        name: "OpenAI weekly-user report",
        blurb:
          "OpenAI reported that approximately 0.15% of its weekly active users engage in conversations indicating potential suicidal planning or intent, representing more than one million people per week globally.",
        ceiling: {
          display: "≈ 1M / week globally",
          note: "Upper bound — proxy from disclosed proportion. No upper bound for 2024 was disclosed.",
        },
      },
    ],
    trend: "increasing",
    confidenceTier: 2,
    confidenceLabel: "Low",
    summary:
      "OECD AIM results increase over consecutive time periods. The limited AIID matches and upper-bound proxy likely reflect limited awareness and detection methods in 2024. Given the shifts in measurement and mitigation, expert elicitation or close monitoring of 2026 data is necessary before drawing high-confidence conclusions.",
  },
  exposure: {
    sources: [
      {
        tag: "PEW",
        name: "Pew Research — Sidoti & McClain, 2025",
        blurb:
          "ChatGPT use “to learn new things” and “for entertainment” by age bucket, 2024–2025.",
        detail:
          "Lower bound takes “for entertainment” only; upper bound takes “to learn new things” only.",
      },
      {
        tag: "FATJOE",
        name: "FATJOE — LLM market-share statistics",
        blurb:
          "ChatGPT holds ≈ 80% market share of LLM personal use.",
        detail:
          "Point estimate: 80%. Lower bound: 70%. Upper bound: 90%.",
      },
    ],
    assumptions: [
      "The Pew share answering “for entertainment” serves as the lower bound on emotional-support use; the share answering “to learn new things” serves as the upper bound; the mid-point of the two serves as the central estimate.",
      "These shares apply uniformly to the US census population in matching age groups.",
      "ChatGPT accounts for 80% of LLM personal use (90% upper / 70% lower) — applied as a scalar to extend ChatGPT shares to all conversational AI use.",
    ],
    estimates: [
      {
        year: "2024",
        central: 64_000_000,
        range: [54_000_000, 73_000_000],
        display: "64M (54–73M)",
      },
      {
        year: "2025",
        central: 88_000_000,
        range: [75_000_000, 99_000_000],
        display: "88M (75–99M)",
      },
    ],
    trend: "increasing",
    confidenceTier: 2,
    confidenceLabel: "Medium",
    summary:
      "Estimates suggest approximately a 40% increase in US emotional-support use of conversational AI between 2024 and 2025. Order-of-magnitude estimate: 10⁸.",
  },
  classification: "escalating",
  verdict:
    "Both the population at risk and the harm per unit exposure are growing. This demands an urgent response: expanded monitoring, active investigation into causal drivers, and possibly regulatory intervention.",
};

// ── Case 2: Autonomous vehicles and injury/damage ───────────────────────────
// Source: paper §3.2.

export const avCase: CaseStudy = {
  id: "av",
  label: "Autonomous vehicles and injury/damage",
  shortLabel: "AV",
  mq: {
    subject: "autonomous vehicles (SAE Levels 3 through 5)",
    opportunity: "on US public roads",
    riskEvent: "experience incidents involving injury or property damage",
    timeframe: "per million vehicle-miles, per calendar year",
  },
  harm: {
    sources: [
      {
        kind: "count",
        tag: "NHTSA",
        name: "US National Highway Traffic Safety Administration",
        blurb:
          "Mandatory reporting from manufacturers and operators of vehicles with automated driving or SAE Level 2 advanced driver assistance. Automated Driving System (ADS) incidents rose from 526 in 2024 to 975 in 2025 — a ≈85.4% increase, primarily driven by property damage cases.",
        values: [
          { year: "2024", value: 526 },
          { year: "2025", value: 975 },
        ],
      },
    ],
    trend: "increasing",
    confidenceTier: 1,
    confidenceLabel: "High",
    summary:
      "Tier 1 — mandatory reporting ensures NHTSA provides a comprehensive dataset for analysis. The increase is primarily driven by property-damage cases rather than injury cases.",
  },
  exposure: {
    sources: [
      {
        tag: "AVIA",
        name: "Autonomous Vehicle Industry Association — 2025 State of AV report",
        blurb:
          "AVs drove 145M miles on US public roads from June 2024 to May 2025, compared to 75M miles in 2023–2024 — roughly a doubling in exposure over one year.",
        detail:
          "Used as the point estimate's anchor for whole-year totals.",
      },
      {
        tag: "WAYMO",
        name: "Waymo / CNBC paid-ride reports",
        blurb:
          "Waymo delivered ≈ 250,000 paid rides per week in April 2025 and ≈ 450,000 by December 2025 — an 80% increase in eight months.",
        detail:
          "Implies a monthly growth rate applied to the AVIA central estimate.",
      },
    ],
    assumptions: [
      "The point estimate uses the AVIA anchor and assumes the monthly growth rate implied by Waymo's 2025 trajectory.",
      "The lower bound uses AVIA's May 2024 and May 2025 endpoint totals for the whole years 2024 and 2025 respectively.",
      "The upper bound increases the point estimate by 10%, mirroring the gap between the lower bound and the point estimate.",
    ],
    estimates: [
      {
        year: "2024",
        central: 78_000_000,
        range: [75_000_000, 86_000_000],
        display: "78M mi (75–86M)",
      },
      {
        year: "2025",
        central: 156_000_000,
        range: [145_000_000, 171_000_000],
        display: "156M mi (145–171M)",
      },
    ],
    trend: "increasing",
    confidenceTier: 2,
    confidenceLabel: "Medium",
    summary:
      "Exposure is estimated to have approximately doubled between 2024 and 2025. Order-of-magnitude estimate: 10⁸.",
  },
  classification: "mitigating",
  verdict:
    "Exposure growth (≈ 100%) outpaces harm growth (≈ 85%), yielding a decreasing harm-per-exposure trend [Ĥ ↓] against rising exposure [E ↑]. Fewer incidents occur per million vehicle-miles, suggesting current safeguards keep pace with deployment. Absolute harm may still rise and warrants continued monitoring.",
};

// ── Quadrant copy ───────────────────────────────────────────────────────────
// Source: paper §2.2.

export const quadrantCopy: Record<
  Quadrant,
  {
    label: string;
    description: string;
    summary: string;
    trends: { h: string; e: string };
  }
> = {
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

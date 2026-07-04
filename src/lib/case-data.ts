// All numbers, sources, and assumptions are drawn from the paper
// "A Pragmatic Classification Framework for AI Incident Monitoring"
// (Mengesha et al., 2026), §3.1 and Appendix E. The paper PDF is the source
// of truth — this file mirrors it but does not paraphrase the full analysis.

export type Quadrant = "escalating" | "mitigating" | "receding" | "concentrating";
export type TrajectoryCategory = Quadrant | "unclassifiable";
export type Trend = "increasing" | "decreasing" | "indeterminate";
export type ConfidenceLabel = "High" | "Medium" | "Low";

export type YearValue = { year: string; value: number; display: string };

export type LowerBoundSource = {
  tag: string; // e.g. "AIID"
  name: string;
  blurb: string;
  matches: YearValue[]; // full-match counts per period (bar pairs)
  note: string;
};

export type RatioPeriod = {
  period: string; // e.g. "Jan 24 – Jul 25"
  desired: number; // percentage 0–100
  undesired: number;
};

export type HarmPointEstimate = {
  tag: string;
  name: string;
  blurb: string;
  rateDisplay: string; // "≈0.15% of WAU"
  rateNote: string;
  ratios: RatioPeriod[];
  estimates: YearValue[]; // harmful conversations per period
};

export type FunnelRow = {
  label: string; // e.g. "ChatGPT weekly active users"
  operation: string | null; // e.g. "÷ traffic share" — null for the base row
  detail: string; // e.g. "140M → 300M → ≈850M"
};

export type TrendConclusion = {
  trend: Trend;
  multiplierDisplay: string; // e.g. "×~1.7"
  arrow: string; // e.g. "Ĥ ↑"
  confidenceTier: 1 | 2 | 3;
  confidenceLabel: ConfidenceLabel;
  summary: string;
};

export type ClassificationWeights = Record<TrajectoryCategory, number>;

// ── Case study: conversational AI systems and self-harm ────────────────────
// Source: paper §3.1.

export const chatbotCase = {
  id: "chatbot",
  label: "Conversational AI and self-harm",
  shortLabel: "Chatbot",

  mq: {
    subject: "conversations between US users and conversational AI systems",
    opportunity: "in which users seek support regarding suicidal ideation or self-harm",
    riskEvent: "AI systems encourage, or fail to discourage, suicidal ideation or self-harm",
    timeframe: "per calendar year",
  },

  harm: {
    lowerBounds: [
      {
        tag: "AIID",
        name: "AI Incident Database",
        blurb:
          "LLM analysis of the AIID found 2 full matches in 2024 and 12 in 2025. The 2025 assessed harm count spans 10,014–110,025 — three matches are composite narratives covering populations, not individuals.",
        matches: [
          { year: "2024", value: 2, display: "2" },
          { year: "2025", value: 12, display: "12" },
        ],
        note: "Assessed harm count: 2 (2024) → 10,014–110,025 (2025).",
      },
      {
        tag: "OECD AIM",
        name: "OECD AI Incidents Monitor",
        blurb:
          "Filtered for US-based incidents involving chatbots or content generation resulting in death, physical or psychological harm: 8 full matches in 2024 and 77 in 2025. Most are duplicates, lawsuits, or composite narratives.",
        matches: [
          { year: "2024", value: 8, display: "8" },
          { year: "2025", value: 77, display: "77" },
        ],
        note: "De-duplicated individual cases: 1 (2024) → 3 (2025).",
      },
    ] satisfies LowerBoundSource[],

    pointEstimate: {
      tag: "OPENAI",
      name: "OpenAI disclosed response quality",
      blurb:
        "OpenAI reports that around 0.15% of weekly active users have conversations with explicit indicators of potential suicidal planning or intent, and disclosed the ratio of desired to undesired model responses on such conversations across three periods.",
      rateDisplay: "≈0.15% of WAU",
      rateNote: "conversations with explicit suicidal-planning indicators",
      ratios: [
        { period: "Jan 24 – Jul 25", desired: 40, undesired: 60 },
        { period: "Aug – Sep 25", desired: 80, undesired: 20 },
        { period: "Oct – Dec 25", desired: 92, undesired: 8 },
      ],
      estimates: [
        { year: "2024", value: 2_400_000, display: "≈2.4M" },
        { year: "2025", value: 4_000_000, display: "≈4M" },
      ],
    } satisfies HarmPointEstimate,

    conclusion: {
      trend: "increasing",
      multiplierDisplay: "×~1.7",
      arrow: "H ↑",
      confidenceTier: 2,
      confidenceLabel: "Medium",
      summary:
        "Derived from reasonable publicly available proxy sources. The lower-bound estimates, although individually unrepresentative, are directionally consistent with the point estimates.",
    } satisfies TrendConclusion,
  },

  exposure: {
    definition: "Exposure counts conversations matching the opportunity — not people.",
    funnel: [
      {
        label: "ChatGPT weekly active users",
        operation: null,
        detail: "140M (Jan 24) → 300M (Jan 25) → ≈850M (Dec 25)",
      },
      {
        label: "All conversational AI platforms",
        operation: "÷ OpenAI share of gen-AI traffic",
        detail: "~75% (2024) falling to ~60% (2025)",
      },
      {
        label: "US-based weekly active users",
        operation: "× ~18% US-based",
        detail: "≈34M (Jan 24) → ≈243M (Dec 25)",
      },
      {
        label: "Conversations matching [O]",
        operation: "× ≈0.15% weekly, summed",
        detail: "one user may have multiple matching conversations",
      },
    ] satisfies FunnelRow[],
    estimates: [
      { year: "2024", value: 4_000_000, display: "≈4M" },
      { year: "2025", value: 12_000_000, display: "≈12M" },
    ] satisfies YearValue[],

    conclusion: {
      trend: "increasing",
      multiplierDisplay: "×~3",
      arrow: "E ↑",
      confidenceTier: 2,
      confidenceLabel: "Medium",
      summary:
        "Derived from reasonable publicly available proxy sources. Main limitation is aggregation bias: ChatGPT data proxies for all conversational AI platforms, and conversations are treated as equivalent regardless of user age.",
    } satisfies TrendConclusion,
  },

  classification: {
    quadrant: "mitigating" as Quadrant,
    hRatioDisplay: "×~0.55",
    eRatioDisplay: "×~3",
    confidenceLabel: "Medium" as ConfidenceLabel,
    // Adjusted weights from the paper's probabilistic classifier, based on
    // uncertainty factors of ~2 on both harm estimates and 1.5 on both
    // exposure estimates (§2.3, Appendix E).
    weights: {
      mitigating: 0.586,
      unclassifiable: 0.316,
      escalating: 0.098,
      concentrating: 0,
      receding: 0,
    } satisfies ClassificationWeights,
    verdict:
      "Per-unit-exposure harm is decreasing while more people are exposed — existing safeguards appear to be working. Absolute harm is still increasing: a Mitigating classification must always be read alongside the absolute estimates.",
  },
} as const;

export type ChatbotCase = typeof chatbotCase;

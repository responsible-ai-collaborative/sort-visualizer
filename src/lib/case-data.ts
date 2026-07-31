// All numbers, sources, and assumptions are drawn from the paper
// "A Pragmatic Classification Framework for AI Incident Monitoring"
// (Mengesha et al., 2026), §3.1 and Appendix E. The paper PDF is the source
// of truth — this file mirrors it but does not paraphrase the full analysis.

export type Quadrant = "escalating" | "mitigating" | "receding" | "concentrating";
export type TrajectoryCategory = Quadrant | "unclassifiable";
export type Trend = "increasing" | "decreasing" | "indeterminate";
export type ConfidenceLabel = "High" | "Medium" | "Low";

export type YearValue = { year: string; value: number; display: string };

// External citation behind a card's numbers — rendered as a small "source ↗"
// link on the card. `label` names the source (shown as the link title).
// URLs are the ones cited in the paper's references for §3.1.
export type SourceLink = { label: string; href: string };

// Incident-database check on the point estimate's lower band — the AIID is
// not an input to the classification itself; when its recorded counts come
// close to the point estimate they raise the lower band of its uncertainty
// interval.
export type IncidentCheckSource = {
  tag: string; // e.g. "AIID"
  name: string;
  blurb: string;
  matches: YearValue[]; // full-match counts per period (bar pairs)
  note: string;
  sourceLinks: SourceLink[];
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
  sourceLinks: SourceLink[];
};

export type FunnelRow = {
  label: string; // e.g. "ChatGPT weekly active users"
  operation: string | null; // e.g. "÷ traffic share" — null for the base row
  detail: string; // e.g. "140M → 300M → ≈850M"
  // Omitted for rows that are derived from the rows above rather than read
  // from an external source.
  sourceLinks?: SourceLink[];
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
    riskEvent: "the AI encourages, or fails to discourage, suicidal ideation or self-harm",
    // Same risk event as the [R] box, inflected for the assembled question
    // ("…in how many does the AI encourage, or fail to discourage…").
    riskEventClause: "encourage, or fail to discourage, suicidal ideation or self-harm",
    timeframe: "per calendar year",
  },

  harm: {
    // The OECD AIM appears only in Act 1 as motivation ("numbers go up") —
    // the worked example does not use it as an estimation source because of
    // duplication problems in its automated scraping pipeline.
    incidentCheck: {
      tag: "AIID",
      name: "AI Incident Database",
      blurb:
        "LLM analysis of the AIID found 2 full matches in 2024 and 12 in 2025. The 2025 assessed harm count spans 10,014–110,025 — three matches are composite narratives covering populations, not individuals. Used only to check the lower band of the point estimate's uncertainty interval.",
      matches: [
        { year: "2024", value: 2, display: "2" },
        { year: "2025", value: 12, display: "12" },
      ],
      note: "Assessed harm count: 2 (2024) → 10,014–110,025 (2025).",
      sourceLinks: [{ label: "AI Incident Database", href: "https://incidentdatabase.ai" }],
    } satisfies IncidentCheckSource,

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
      sourceLinks: [
        {
          label: "OpenAI — Strengthening ChatGPT's responses in sensitive conversations (2025)",
          href: "https://openai.com/index/strengthening-chatgpt-responses-in-sensitive-conversations/",
        },
      ],
    } satisfies HarmPointEstimate,

    conclusion: {
      trend: "increasing",
      multiplierDisplay: "×~1.7",
      arrow: "H ↑",
      confidenceTier: 2,
      confidenceLabel: "Medium",
      summary:
        "Derived from reasonable publicly available proxy sources. The AIID's sparse recorded counts are directionally consistent with the point estimate, but lift the lower band of its uncertainty interval only marginally.",
    } satisfies TrendConclusion,
  },

  exposure: {
    definition: "Exposure counts conversations matching the opportunity — not people.",
    funnel: [
      {
        label: "ChatGPT weekly active users",
        operation: null,
        detail: "140M (Jan 24) → 300M (Jan 25) → ≈850M (Dec 25)",
        sourceLinks: [
          {
            label: "OpenAI — ChatGPT usage and adoption patterns at work (2025)",
            href: "https://openai.com/business/guides-and-resources/chatgpt-usage-and-adoption-patterns-at-work/",
          },
          {
            label: "Backlinko — ChatGPT statistics (2026)",
            href: "https://backlinko.com/chatgpt-stats",
          },
        ],
      },
      {
        label: "All conversational AI platforms",
        operation: "÷ OpenAI share of gen-AI traffic",
        detail: "~75% (2024) falling to ~60% (2025)",
        sourceLinks: [
          {
            label: "Similarweb — Gen AI website traffic share (2026)",
            href: "https://x.com/Similarweb/status/2032019226806951989",
          },
        ],
      },
      {
        label: "US-based weekly active users",
        operation: "× ~18% US-based",
        detail: "≈34M (Jan 24) → ≈243M (Dec 25)",
        sourceLinks: [
          {
            label: "Exploding Topics — ChatGPT users (2026)",
            href: "https://explodingtopics.com/blog/chatgpt-users",
          },
        ],
      },
      {
        label: "Conversations matching [O]",
        operation: "× ≈0.15% weekly, summed",
        detail: "one user may have multiple matching conversations",
        sourceLinks: [
          {
            label: "OpenAI — Strengthening ChatGPT's responses in sensitive conversations (2025)",
            href: "https://openai.com/index/strengthening-chatgpt-responses-in-sensitive-conversations/",
          },
        ],
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
    // Inputs to the paper's probabilistic classifier (Algorithm 2,
    // Appendix E): point estimates from §3.1, uncertainty factors ~2 on both
    // harm estimates and 1.5 on both exposure estimates, incident-database
    // floors (AIID assessed harm counts), and an indifference band of 5% —
    // "a few percent" in the paper; 5% reproduces the published weights
    // below within Monte Carlo noise.
    classifierInputs: {
      h1: 2_400_000,
      h2: 4_000_000,
      e1: 4_000_000,
      e2: 12_000_000,
      uH: 2,
      uE: 1.5,
      eps: 0.05,
      floorH1: 2,
      floorH2: 10_014,
    },
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

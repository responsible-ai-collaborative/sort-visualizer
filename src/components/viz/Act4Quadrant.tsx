"use client";

import { QuadrantChart, type DotProps } from "@/components/viz/QuadrantChart";
import { resolveAct4 } from "@/lib/step-config";
import { chatbotCase } from "@/lib/case-data";

// The chatbot case lands in the mitigating quadrant: Ĥ ↓ (×~0.55), E ↑ (×~3).
// Lower-right. The deep token keeps the dot legible on the light background.
const CHATBOT_DOT: DotProps = {
  x: 0.78,
  y: 0.78,
  color: "var(--mitigating-deep)",
  label: chatbotCase.shortLabel,
  caseLabel: "Chatbot · self-harm",
};

export function Act4Quadrant({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct4(activeStep);
  return (
    <QuadrantChart
      activeQuadrant={state.activeQuadrant}
      dot={state.dot ? CHATBOT_DOT : null}
      weights={state.weights ? chatbotCase.classification.weights : null}
      showVerdict={state.verdict}
      verdictDetail={chatbotCase.classification.verdict}
    />
  );
}

"use client";

import { QuadrantChart, type DotProps } from "@/components/viz/QuadrantChart";
import { resolveAct4 } from "@/lib/step-config";

// Chatbot lands in the escalating quadrant: Ĥ↑, E↑. Upper-right.
const CHATBOT_DOT: DotProps = {
  x: 0.78,
  y: 0.22,
  color: "var(--escalating)",
  label: "Chatbot",
  caseLabel: "Chatbot · self-harm",
};

export function Act4Quadrant({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct4(activeStep);
  return (
    <QuadrantChart
      activeQuadrant={state.activeQuadrant}
      dot={state.dot ? CHATBOT_DOT : null}
      showVerdict={state.verdict}
    />
  );
}

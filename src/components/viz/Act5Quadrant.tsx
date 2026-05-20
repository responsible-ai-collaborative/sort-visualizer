"use client";

import { QuadrantChart, type DotProps } from "@/components/viz/QuadrantChart";
import { resolveAct5 } from "@/lib/step-config";

// AV lands in the mitigating quadrant: Ĥ↓, E↑. Bottom-right under the new
// orientation (x = E trend, y = Ĥ trend).
const AV_DOT: DotProps = {
  x: 0.78,
  y: 0.72,
  color: "var(--mitigating)",
  label: "AV",
  caseLabel: "AV · injury/damage",
};

// Chatbot ghost at the escalating position from Act 4.
const CHATBOT_GHOST: DotProps = {
  x: 0.78,
  y: 0.22,
  color: "var(--escalating)",
  label: "Chatbot",
  caseLabel: "Chatbot",
};

export function Act5Quadrant({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct5(activeStep);
  return (
    <QuadrantChart
      activeQuadrant={state.activeQuadrant}
      dot={state.dot ? AV_DOT : null}
      ghostDot={state.ghost ? CHATBOT_GHOST : null}
      showVerdict={state.verdict}
    />
  );
}

"use client";

import { QuadrantChart } from "@/components/viz/QuadrantChart";

// Early reveal of the framework's output shape — the 2 × 2 trajectory grid,
// with labels and axes only. No dots yet. Reader sees where the analysis is
// heading before they start building the monitoring question.
export function FrameworkOutputViz(_props: { activeStep: string | null }) {
  return <QuadrantChart activeQuadrant={null} dot={null} />;
}

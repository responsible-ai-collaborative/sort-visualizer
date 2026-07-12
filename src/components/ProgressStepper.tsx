"use client";

import { STAGES, type StageId } from "@/lib/stages";

// Sticky horizontal stepper at the top of the viewport during the four-stage
// framework. The current stage is filled with the accent color; the others
// are dimmed. Reader always sees where they are in the system.

export function ProgressStepper({ activeStage }: { activeStage: StageId | null }) {
  const visible = activeStage !== null;

  return (
    <div
      // `inert` (not aria-hidden) so the anchors also drop out of the tab
      // order while hidden — aria-hidden over focusable content is invalid.
      inert={!visible}
      className={
        "fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-[rgba(255,255,255,0.78)] border-b border-rule transition-[opacity,transform] duration-300 " +
        (visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none")
      }
      role="navigation"
      aria-label="Framework progress"
    >
      <ol className="mx-auto max-w-[1100px] px-4 sm:px-8 py-1.5 md:py-2 flex items-stretch gap-1.5 md:gap-2">
        {STAGES.map((stage, i) => {
          const isActive = stage.id === activeStage;
          return (
            <li
              key={stage.id}
              className={
                "flex items-center gap-1.5 md:gap-2 min-w-0 " +
                // Below md only the active stage keeps its label, so it takes
                // the row's width; the others shrink to number chips.
                (isActive ? "flex-1" : "md:flex-1")
              }
            >
              <a
                href={`#${stage.sectionIds[0]}`}
                className={
                  "flex flex-col justify-center flex-1 min-w-0 px-2.5 py-1 md:px-3 md:py-1.5 border transition-colors duration-300 " +
                  (isActive
                    ? "border-accent bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]"
                    : "border-rule bg-[rgba(255,255,255,0.5)] hover:border-accent/40")
                }
              >
                <span
                  className={
                    "max-md:hidden font-display italic text-[11px] leading-tight transition-colors duration-300 " +
                    (isActive ? "text-accent-text" : "text-ink-faint")
                  }
                >
                  Stage {i + 1} of {STAGES.length}
                </span>
                <span className="md:hidden flex items-baseline gap-1.5">
                  <span
                    className={
                      "font-mono text-[11px] leading-tight " +
                      (isActive ? "text-accent-text font-bold" : "text-ink-faint")
                    }
                  >
                    {i + 1}
                  </span>
                  {isActive ? (
                    <span className="font-body text-[13px] leading-tight truncate text-accent-text font-semibold">
                      {stage.short}
                    </span>
                  ) : null}
                </span>
                <span
                  className={
                    "max-md:hidden font-body text-[13px] leading-tight truncate mt-0.5 transition-colors duration-300 " +
                    (isActive ? "text-accent-text font-semibold" : "text-ink-soft")
                  }
                >
                  {stage.short}
                </span>
              </a>
              {i < STAGES.length - 1 ? (
                <span aria-hidden className="text-ink-faint text-[12px] flex-shrink-0 select-none">
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

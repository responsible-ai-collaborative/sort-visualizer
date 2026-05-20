"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { STAGES } from "@/lib/stages";

gsap.registerPlugin(useGSAP);

// Vertical 4-box flow chart of the framework stages. Used as the Act 1
// step-1.3 viz in place of the climbing-line chart.

export function FrameworkFlow({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!visible) return;
      gsap.fromTo(
        ".framework-flow-box",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        ".framework-flow-arrow",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          stagger: 0.12,
          delay: 0.1,
          ease: "power2.out",
        },
      );
    },
    { scope: ref, dependencies: [visible] },
  );

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 w-full max-w-[380px]">
      {STAGES.map((stage, i) => (
        <div key={stage.id} className="flex flex-col items-center w-full">
          <div
            className="framework-flow-box border border-rule bg-[rgba(255,255,255,0.7)] px-5 py-3 w-full"
            style={{ opacity: 0 }}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint leading-tight">
                Stage {stage.number} of 4
              </span>
              <span aria-hidden className="text-ink-faint text-[9px]">·</span>
              <span className="font-body italic text-[11px] text-ink-faint leading-tight">
                {stage.sub}
              </span>
            </div>
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink mt-1 leading-tight">
              {stage.short}
            </div>
            <p className="font-body text-[12px] text-ink-soft leading-snug mt-1.5">
              {stage.detail}
            </p>
          </div>
          {i < STAGES.length - 1 ? (
            <span
              aria-hidden
              className="framework-flow-arrow text-ink-faint text-[16px] py-1 select-none"
              style={{ opacity: 0 }}
            >
              ↓
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

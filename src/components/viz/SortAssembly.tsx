"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { resolveAct2 } from "@/lib/step-config";
import { chatbotCase } from "@/lib/case-data";
import { Em } from "@/components/Em";

type LetterKey = "S" | "O" | "R" | "T";

const LETTERS: {
  key: LetterKey;
  name: string;
  prompt: string;
  color: string;
  content: string;
}[] = [
  {
    key: "S",
    name: "Subject",
    prompt: "Who or what is at risk?",
    color: "#7c4d8a",
    content: chatbotCase.mq.subject,
  },
  {
    key: "O",
    name: "Opportunity",
    prompt: "What creates the exposure?",
    color: "#3f6f9f",
    content: chatbotCase.mq.opportunity,
  },
  {
    key: "R",
    name: "Risk event",
    prompt: "What specific harm?",
    color: "#4a6d3d",
    content: chatbotCase.mq.riskEvent,
  },
  {
    key: "T",
    name: "Timeframe",
    prompt: "Over what period?",
    color: "#b08428",
    content: chatbotCase.mq.timeframe,
  },
];

const FADE = { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] as const };

// The letter each step focuses on. Below md only that box is shown full-size
// (the others collapse into the chip row) so the stack fits the 40vh pin.
const ACTIVE_LETTER: Record<string, LetterKey> = {
  "2.2": "S",
  "2.3": "O",
  "2.4": "R",
  "2.5": "T",
};

export function SortAssembly({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct2(activeStep);
  const reduced = useReducedMotion();
  const tDur = reduced ? 0 : FADE.duration;
  const activeLetter = activeStep ? (ACTIVE_LETTER[activeStep] ?? null) : null;

  return (
    <div
      className="w-full max-w-[560px] px-2"
      role="img"
      aria-label="Four-part SORT monitoring question being assembled for the chatbot self-harm case."
    >
      <AnimatePresence mode="wait">
        {state.boxes && !state.sentence ? (
          <motion.div
            key="boxes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur }}
            className="grid grid-cols-1 gap-2 md:gap-4"
          >
            {activeLetter ? (
              <div className="md:hidden flex items-center justify-center gap-2.5 mb-1">
                {LETTERS.map((l) => (
                  <span
                    key={l.key}
                    className="flex items-center justify-center w-7 h-7 rounded-full font-mono text-[11px] font-bold"
                    style={
                      state.contents[l.key]
                        ? { background: l.color, color: "#fff" }
                        : {
                            border: `1.5px solid ${l.color}`,
                            color: l.color,
                            background: "rgba(255,255,255,0.6)",
                          }
                    }
                    aria-hidden
                  >
                    {l.key}
                  </span>
                ))}
              </div>
            ) : null}
            {LETTERS.map((l, i) => (
              <Box
                key={l.key}
                letter={l}
                filled={state.contents[l.key]}
                tDur={tDur}
                index={i}
                mobileHidden={activeLetter !== null && l.key !== activeLetter}
              />
            ))}
            <div className="hidden md:block md:mt-2 border-t border-rule md:pt-3 font-mono text-[12px] text-ink-faint">
              Among [S] that [O], how many [R] per [T]?
            </div>
          </motion.div>
        ) : null}

        {state.sentence ? (
          <motion.div
            key="sentence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: tDur }}
            className="text-center"
          >
            <div className="font-display italic text-[15px] md:text-[16px] text-ink-faint mb-2 md:mb-4">
              The monitoring question
            </div>
            <p className="font-display text-[17px] md:text-[26px] leading-[1.32] text-ink">
              Among <Em>{chatbotCase.mq.subject}</Em> <Em>{chatbotCase.mq.opportunity}</Em>, in how
              many does the AI <Em>{chatbotCase.mq.riskEventClause}</Em>{" "}
              <Em>{chatbotCase.mq.timeframe}</Em>?
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Box({
  letter,
  filled,
  tDur,
  index,
  mobileHidden,
}: {
  letter: (typeof LETTERS)[number];
  filled: boolean;
  tDur: number;
  index: number;
  mobileHidden?: boolean;
}) {
  return (
    <div className={"flex gap-3 items-start" + (mobileHidden ? " max-md:hidden" : "")}>
      <div
        className="flex items-center justify-center w-7 h-7 rounded-full font-mono text-[11px] font-bold flex-shrink-0 mt-1"
        style={{
          background: letter.color,
          color: "#fff",
        }}
        aria-hidden
      >
        {letter.key}
      </div>
      <div className="flex-1 border border-rule bg-[rgba(255,255,255,0.5)] md:min-h-[60px] py-1.5 md:py-2.5 px-3">
        <div className="font-display italic text-[13px] text-ink-faint">{letter.name}</div>
        {/* The prompt and the (usually taller, multi-line) content differ in
            height, so swapping them would snap the box — and the boxes below
            it — to the new height. SmoothHeight animates the real pixel height
            instead, which reflows the stack without the transform-based squish
            that framer's `layout` would cause on a ~3× height change. */}
        <SmoothHeight duration={tDur}>
          <AnimatePresence mode="wait">
            {filled ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: tDur, delay: 0.05 * index }}
                className="font-body italic text-[15px] leading-snug text-accent-text mt-0.5"
              >
                {letter.content}
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: tDur }}
                className="font-body italic text-[13px] text-ink-faint mt-0.5"
              >
                {letter.prompt}
              </motion.div>
            )}
          </AnimatePresence>
        </SmoothHeight>
      </div>
    </div>
  );
}

// Animates its own height to fit `children` (measured via ResizeObserver) so
// swapping differently-sized content slides the box to the new height instead
// of snapping. Real height animation, so the surrounding flow reflows and the
// text is never distorted. Starts at `auto`; the first measure resolves to a
// pixel height with no visible tween.
function SmoothHeight({ duration, children }: { duration: number; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration, ease: [...FADE.ease] }}
      style={{ overflow: "hidden" }}
    >
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}

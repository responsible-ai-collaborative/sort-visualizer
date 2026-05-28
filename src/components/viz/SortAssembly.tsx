"use client";

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

export function SortAssembly({ activeStep }: { activeStep: string | null }) {
  const state = resolveAct2(activeStep);
  const reduced = useReducedMotion();
  const tDur = reduced ? 0 : FADE.duration;

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
            className="grid grid-cols-1 gap-4"
          >
            {LETTERS.map((l, i) => (
              <Box
                key={l.key}
                letter={l}
                filled={state.contents[l.key]}
                tDur={tDur}
                index={i}
              />
            ))}
            <div className="mt-2 border-t border-rule pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
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
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint mb-4">
              The monitoring question
            </div>
            <p
              className="font-display text-[22px] md:text-[26px] leading-[1.32] text-ink"
            >
              Among <Em>{chatbotCase.mq.subject}</Em>{" "}
              <Em>{chatbotCase.mq.opportunity}</Em>, how many{" "}
              <Em>{chatbotCase.mq.riskEvent}</Em>{" "}
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
}: {
  letter: (typeof LETTERS)[number];
  filled: boolean;
  tDur: number;
  index: number;
}) {
  return (
    <div className="flex gap-3 items-start">
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
      <div className="flex-1 border border-rule bg-[rgba(255,255,255,0.5)] min-h-[60px] py-2.5 px-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
          {letter.name}
        </div>
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
      </div>
    </div>
  );
}

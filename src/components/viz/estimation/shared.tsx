"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TierBadge } from "@/components/TierBadge";
import type { SourceLink, TrendConclusion } from "@/lib/case-data";

gsap.registerPlugin(useGSAP);

// Layout primitives + GSAP helpers shared by HarmPanel and ExposurePanel.
// Every animation helper takes `reduced`: when the user prefers reduced
// motion we jump straight to the final state with gsap.set (the CSS
// media-query in globals.css does not cover JS tweens).

export function PanelHeader({
  letter,
  title,
  role,
  carryover,
}: {
  letter: string;
  title: string;
  role: string;
  carryover?: ReactNode;
}) {
  return (
    <header className="mb-3 pb-2.5 md:mb-5 md:pb-4 border-b border-rule flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 md:gap-3">
        <div
          className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center font-display font-bold text-[20px] md:text-[26px] text-white"
          style={{ background: "var(--accent)" }}
          aria-hidden
        >
          {letter}
        </div>
        <div>
          <div className="font-display italic text-[13px] md:text-[14px] text-ink-faint">
            {role}
          </div>
          <h3 className="font-display text-[19px] md:text-[23px] leading-tight text-ink font-medium">
            {title}
          </h3>
        </div>
      </div>
      {carryover ? (
        <div className="max-md:hidden text-right font-display italic text-[13px] text-ink-faint max-w-[190px] leading-snug">
          {carryover}
        </div>
      ) : null}
    </header>
  );
}

// Small right-aligned "source ↗" link(s) for the citation behind a card's
// numbers; the source name lives in the title/aria-label.
export function SourceLinks({ links }: { links?: readonly SourceLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <span className="whitespace-nowrap">
      {links.map((link, i) => (
        <span key={link.href}>
          {i > 0 ? (
            <span aria-hidden className="text-ink-faint text-[11px]">
              {" · "}
            </span>
          ) : null}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            aria-label={`Source: ${link.label}`}
            className="font-display italic text-[11px] text-accent-text hover:underline"
          >
            {links.length > 1 ? `source ${i + 1}` : "source"} ↗
          </a>
        </span>
      ))}
    </span>
  );
}

export function SourceCard({
  tag,
  role,
  sources,
  className,
  children,
}: {
  tag: string;
  role: string;
  sources?: readonly SourceLink[];
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`${className ?? ""} source-card border border-rule p-3 md:p-4`}
      style={{ background: "rgba(255, 255, 255, 0.7)" }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <span className="font-body font-semibold text-[14px] text-accent-text">{tag}</span>
        <span className="flex items-baseline justify-end gap-2 flex-wrap text-right">
          <span className="font-display italic text-[13px] text-ink-faint">{role}</span>
          <SourceLinks links={sources} />
        </span>
      </div>
      {children}
    </article>
  );
}

export function ConclusionBar({
  className,
  conclusion,
}: {
  className?: string;
  conclusion: TrendConclusion;
}) {
  const trendLabel = conclusion.trend.charAt(0).toUpperCase() + conclusion.trend.slice(1);
  return (
    <div
      className={`${className ?? ""} conclusion-bar opacity-0 mt-3 pt-3 md:mt-5 md:pt-4 border-t border-rule flex items-center justify-between gap-4`}
    >
      <div>
        <div className="font-display italic text-[13px] md:text-[14px] text-ink-faint mb-1">
          Trend
        </div>
        <div className="font-display text-[18px] md:text-[21px] leading-none font-medium text-accent-text">
          {trendLabel} {conclusion.multiplierDisplay}{" "}
          <span className="whitespace-nowrap text-ink-faint font-normal font-mono text-[13px] md:text-[15px]">
            · {conclusion.arrow}
          </span>
        </div>
      </div>
      <TierBadge tier={conclusion.confidenceTier} label={conclusion.confidenceLabel} />
    </div>
  );
}

// Big paired year → value figures, used for the harm and exposure estimates.
export function EstimatePair({
  estimates,
}: {
  estimates: readonly { year: string; display: string }[];
}) {
  return (
    <div className="flex items-end justify-around gap-4">
      {estimates.map((e) => (
        <div key={e.year} className="text-center">
          <div className="font-mono text-[12px] text-ink-faint mb-1">{e.year}</div>
          <div
            className="font-display font-bold text-[32px] md:text-[42px] leading-none text-accent-text"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {e.display}
          </div>
        </div>
      ))}
    </div>
  );
}

// Year-on-year bar pair with count-up labels.
export function BarPair({
  v1,
  v2,
  max,
  rootClass,
  reduced,
}: {
  v1: number;
  v2: number;
  max: number;
  rootClass: string;
  reduced: boolean;
}) {
  const W = 200;
  const H = 130;
  const barW = 50;
  const x1 = 30;
  const x2 = 110;
  const padBottom = 24;
  const padTop = 28;
  const h1 = (v1 / max) * (H - padTop - padBottom);
  const h2 = (v2 / max) * (H - padTop - padBottom);

  const bar1Ref = useRef<SVGRectElement>(null);
  const bar2Ref = useRef<SVGRectElement>(null);
  const num1Ref = useRef<SVGTextElement>(null);
  const num2Ref = useRef<SVGTextElement>(null);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set([bar1Ref.current, bar2Ref.current], { scaleY: 1 });
        if (num1Ref.current) num1Ref.current.textContent = String(v1);
        if (num2Ref.current) num2Ref.current.textContent = String(v2);
        return;
      }
      // Bars grow with overshoot
      gsap.set([bar1Ref.current, bar2Ref.current], {
        scaleY: 0,
        transformOrigin: "center bottom",
        transformBox: "fill-box",
      });
      gsap.to(bar1Ref.current, {
        scaleY: 1,
        duration: 0.7,
        ease: "back.out(1.2)",
        delay: 0.2,
      });
      gsap.to(bar2Ref.current, {
        scaleY: 1,
        duration: 0.7,
        ease: "back.out(1.2)",
        delay: 0.35,
      });
      // Numbers count up
      countUpEl(num1Ref.current, v1, 0.8, 0.4);
      countUpEl(num2Ref.current, v2, 0.8, 0.55);
    },
    { scope: `.${rootClass}`, dependencies: [v1, v2, reduced] },
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-[170px] md:w-[200px] flex-shrink-0">
      <line
        x1={10}
        x2={W - 10}
        y1={H - padBottom + 1}
        y2={H - padBottom + 1}
        stroke="var(--rule)"
        strokeWidth={1}
      />
      <rect
        ref={bar1Ref}
        x={x1}
        y={H - padBottom - h1}
        width={barW}
        height={Math.max(h1, 2)}
        fill="var(--accent)"
        opacity={0.7}
      />
      <text
        ref={num1Ref}
        x={x1 + barW / 2}
        y={H - padBottom - h1 - 8}
        textAnchor="middle"
        fontFamily="var(--next-font-heading)"
        fontWeight="700"
        fontSize="22"
        fill="var(--ink)"
      >
        0
      </text>
      <text
        x={x1 + barW / 2}
        y={H - 6}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono)"
        fontSize="10"
        fill="var(--ink-faint)"
        letterSpacing="0.06em"
      >
        2024
      </text>
      <rect
        ref={bar2Ref}
        x={x2}
        y={H - padBottom - h2}
        width={barW}
        height={Math.max(h2, 2)}
        fill="var(--accent)"
      />
      <text
        ref={num2Ref}
        x={x2 + barW / 2}
        y={H - padBottom - h2 - 8}
        textAnchor="middle"
        fontFamily="var(--next-font-heading)"
        fontWeight="700"
        fontSize="22"
        fill="var(--ink)"
      >
        0
      </text>
      <text
        x={x2 + barW / 2}
        y={H - 6}
        textAnchor="middle"
        fontFamily="var(--font-jetbrains-mono)"
        fontSize="10"
        fill="var(--ink-faint)"
        letterSpacing="0.06em"
      >
        2025
      </text>
    </svg>
  );
}

// ── GSAP helpers ──────────────────────────────────────────────────────────

export function animateCardIn(selector: string, reduced: boolean, delay = 0) {
  if (reduced) {
    gsap.set(selector, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    selector,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay },
  );
}

export function animateConclusionIn(selector: string, reduced: boolean) {
  if (reduced) {
    gsap.set(selector, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    selector,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.25 },
  );
}

export function countUpEl(el: SVGTextElement | null, to: number, duration: number, delay: number) {
  if (!el) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: to,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = String(Math.round(obj.val));
    },
  });
}

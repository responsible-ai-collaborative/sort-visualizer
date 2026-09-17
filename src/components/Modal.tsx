"use client";

// Lightweight accessible dialog: fixed overlay + centered panel, closes on
// Escape, backdrop click, or the ✕ button. Fixed positioning avoids a portal
// while still floating above the (overflow-hidden) page. Focus moves to the
// close button on open and is restored to the trigger on close.

import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  accent,
  maxWidth = "440px",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  accent?: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-[rgba(1,25,52,0.32)]" onClick={onClose} aria-hidden />
      <div
        className="relative z-10 w-full max-h-[85vh] overflow-y-auto bg-white border border-rule shadow-[0_12px_44px_rgba(1,25,52,0.20)] p-6"
        style={{ maxWidth }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="font-display italic text-[21px] leading-tight" style={{ color: accent }}>
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-rule text-ink-faint hover:border-accent-text hover:text-accent-text transition-colors outline-none focus-visible:border-accent-text"
          >
            {/* SVG cross rather than a ✕ glyph: the glyph's font metrics leave
                it sitting slightly off-center in the circle; an SVG centers
                exactly via the flex box. */}
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M1.5 1.5 L9.5 9.5" />
              <path d="M9.5 1.5 L1.5 9.5" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

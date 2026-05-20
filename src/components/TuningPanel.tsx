"use client";

import { useEffect, useState, useCallback } from "react";
import { useLenis } from "@/lib/useLenis";

type SnapConfig = {
  snapType: "mandatory" | "proximity" | "none";
  snapStop: "always" | "normal";
  landmarks: boolean;
  jsForce: boolean;
  jsForceIdleMs: number;
  jsForceDurationMs: number;
  lenis: boolean;
};

const DEFAULTS: SnapConfig = {
  snapType: "mandatory",
  snapStop: "always",
  landmarks: true,
  jsForce: false,
  jsForceIdleMs: 80,
  jsForceDurationMs: 220,
  lenis: false,
};

const STORAGE_KEY = "sort-tune-v1";

export function TuningPanel() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<SnapConfig>(DEFAULTS);

  useLenis(config.lenis);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SnapConfig>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfig({ ...DEFAULTS, ...parsed });
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Apply CSS-level config to the DOM
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.style.scrollSnapType =
      config.snapType === "none" ? "none" : `y ${config.snapType}`;
    document.body.dataset.snapStop = config.snapStop;
    document.body.dataset.landmarkSnap = config.landmarks ? "on" : "off";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [mounted, config]);

  // JS force-snap: after scroll idle, animate-snap to the nearest snap target.
  useEffect(() => {
    if (!mounted || !config.jsForce) return;

    let timer: number | null = null;
    let raf: number | null = null;
    let forcing = false;
    let lastY = window.scrollY;

    const findNearest = () => {
      const sel = config.landmarks
        ? "[data-step], [data-snap-landmark]"
        : "[data-step]";
      const targets = Array.from(document.querySelectorAll<HTMLElement>(sel));
      const vh = window.innerHeight;
      let best: { targetY: number; dist: number } | null = null;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        const align = el.dataset.snapLandmark ?? "center";
        let targetY: number;
        if (align === "start") targetY = window.scrollY + r.top;
        else if (align === "end") targetY = window.scrollY + r.bottom - vh;
        else targetY = window.scrollY + r.top + r.height / 2 - vh / 2;
        const dist = Math.abs(targetY - window.scrollY);
        if (!best || dist < best.dist) best = { targetY, dist };
      }
      return best;
    };

    const force = () => {
      if (forcing) return;
      const target = findNearest();
      if (!target || target.dist < 1) return;
      forcing = true;
      const startY = window.scrollY;
      const delta = target.targetY - startY;
      const startTime = performance.now();
      const duration = config.jsForceDurationMs;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        window.scrollTo({ top: Math.max(0, startY + delta * eased) });
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = null;
          // brief grace period so our own tail-end scroll events don't
          // immediately re-trigger the catcher
          window.setTimeout(() => {
            forcing = false;
          }, 60);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (forcing) return;
      lastY = window.scrollY;
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.scrollY === lastY) force();
      }, config.jsForceIdleMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer !== null) window.clearTimeout(timer);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [
    mounted,
    config.jsForce,
    config.jsForceIdleMs,
    config.jsForceDurationMs,
    config.landmarks,
  ]);

  const update = useCallback(<K extends keyof SnapConfig>(key: K, value: SnapConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setConfig(DEFAULTS), []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 font-mono text-[11px]">
      {open ? (
        <div
          className="border border-rule p-4 w-[260px] shadow-lg"
          style={{ background: "rgba(250, 250, 250, 0.95)", backdropFilter: "blur(6px)" }}
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-rule">
            <span className="uppercase tracking-[0.16em] text-ink-soft">Tune snap</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close panel"
              className="text-ink-faint hover:text-ink leading-none text-[14px]"
            >
              ×
            </button>
          </div>

          <Field label="Snap type">
            <Segmented
              options={[
                { label: "Mandatory", value: "mandatory" },
                { label: "Proximity", value: "proximity" },
                { label: "Off", value: "none" },
              ]}
              value={config.snapType}
              onChange={(v) => update("snapType", v as SnapConfig["snapType"])}
            />
          </Field>

          <Field label="Snap stop">
            <Segmented
              options={[
                { label: "Always", value: "always" },
                { label: "Normal", value: "normal" },
              ]}
              value={config.snapStop}
              onChange={(v) => update("snapStop", v as SnapConfig["snapStop"])}
            />
          </Field>

          <Field label="Landmark snap">
            <Toggle
              value={config.landmarks}
              onChange={(v) => update("landmarks", v)}
              labels={["Off", "On"]}
            />
          </Field>

          <Field label="Lenis smooth-scroll">
            <Toggle
              value={config.lenis}
              onChange={(v) => update("lenis", v)}
              labels={["Off", "On"]}
            />
          </Field>

          <div className="mt-4 pt-3 border-t border-rule">
            <Field label="JS force-snap">
              <Toggle
                value={config.jsForce}
                onChange={(v) => update("jsForce", v)}
                labels={["Off", "On"]}
              />
            </Field>

            <Field label={`Idle • ${config.jsForceIdleMs}ms`}>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={config.jsForceIdleMs}
                onChange={(e) => update("jsForceIdleMs", Number(e.target.value))}
                disabled={!config.jsForce}
                className="w-full"
              />
            </Field>

            <Field label={`Anim • ${config.jsForceDurationMs}ms`}>
              <input
                type="range"
                min={80}
                max={500}
                step={10}
                value={config.jsForceDurationMs}
                onChange={(e) => update("jsForceDurationMs", Number(e.target.value))}
                disabled={!config.jsForce}
                className="w-full"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-4 w-full border border-rule py-1.5 uppercase tracking-[0.14em] text-ink-soft hover:text-ink hover:border-accent-soft"
          >
            Reset
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open tuning panel"
          className="h-9 px-3 border border-rule uppercase tracking-[0.16em] text-ink-faint hover:text-ink hover:border-accent-soft transition-colors"
          style={{ background: "rgba(250, 250, 250, 0.85)", backdropFilter: "blur(6px)" }}
        >
          ⚙ Tune
        </button>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="uppercase tracking-[0.12em] text-ink-faint mb-1 text-[10px]">
        {label}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex border border-rule">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            "flex-1 py-1 text-center uppercase tracking-[0.08em] transition-colors",
            i > 0 ? "border-l border-rule" : "",
            value === opt.value
              ? "bg-accent text-white"
              : "text-ink-soft hover:text-ink",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  value,
  onChange,
  labels,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  labels: [string, string];
}) {
  return (
    <Segmented
      options={[
        { label: labels[0], value: "off" },
        { label: labels[1], value: "on" },
      ]}
      value={value ? "on" : "off"}
      onChange={(v) => onChange(v === "on")}
    />
  );
}

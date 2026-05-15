export function StepNumber({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="h-px w-6 bg-rule" aria-hidden />
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        Step {n}
      </span>
    </div>
  );
}

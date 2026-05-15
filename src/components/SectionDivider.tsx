export function SectionDivider({ label }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-4 py-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint"
      aria-hidden
    >
      <span>·</span>
      <span>·</span>
      <span>·</span>
      {label ? <span className="ml-3 normal-case font-body italic text-ink-faint">{label}</span> : null}
    </div>
  );
}

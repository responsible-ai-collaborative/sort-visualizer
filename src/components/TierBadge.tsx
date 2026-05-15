type Tier = 1 | 2 | 3;
type Label = "High" | "Medium" | "Low";

const colorForLabel: Record<Label, string> = {
  High: "var(--mitigating)",
  Medium: "var(--concentrating)",
  Low: "var(--accent)",
};

export function TierBadge({ tier, label }: { tier: Tier; label: Label }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] px-2 py-1 border"
      style={{
        borderColor: colorForLabel[label],
        color: colorForLabel[label],
        background: "rgba(255,255,255,0.4)",
      }}
    >
      <span aria-hidden>Tier {tier}</span>
      <span className="opacity-60" aria-hidden>·</span>
      <span>{label}</span>
    </span>
  );
}

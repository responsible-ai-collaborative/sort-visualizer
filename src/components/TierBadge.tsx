type Tier = 1 | 2 | 3;
type Label = "High" | "Medium" | "Low";

const colorForLabel: Record<Label, string> = {
  High: "var(--mitigating-deep)",
  Medium: "var(--concentrating)",
  Low: "var(--accent)",
};

export function TierBadge({ tier, label }: { tier: Tier; label: Label }) {
  return (
    <span
      className="inline-flex items-baseline gap-1.5 px-2 py-1 md:px-2.5 border whitespace-nowrap shrink-0"
      style={{
        borderColor: colorForLabel[label],
        color: colorForLabel[label],
        background: "rgba(255,255,255,0.4)",
      }}
    >
      <span className="font-mono text-[12px]" aria-hidden>
        Tier {tier}
      </span>
      <span className="opacity-60 text-[12px]" aria-hidden>
        ·
      </span>
      <span className="font-display italic text-[14px]">{label}</span>
    </span>
  );
}

export function StepNumber({ n }: { n: string }) {
  // Caption voice, not a chip: a quiet italic marker, the way a paper
  // numbers its paragraphs in the margin.
  return (
    <div className="font-display italic text-[16px] text-ink-faint mb-2.5">Step {Number(n)}</div>
  );
}

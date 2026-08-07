"use client";

// Slider panel for the step-4.4 classifier explorer. Two groups: the point
// estimates (which move the dot) and the uncertainty inputs (which reshape
// the draw cloud and the weights). All initial values are the paper's.

export type ExplorerParams = {
  hMult: number; // H2 / H1
  eMult: number; // E2 / E1
  uH: number;
  uE: number;
  eps: number;
};

const fmtMult = (v: number) => `×${v.toFixed(2)}`;
const fmtU = (v: number) => `×${v.toFixed(1)}`;
const fmtEps = (v: number) => `±${(v * 100).toFixed(0)}%`;

// Small "?" affordance next to a slider label; hover or keyboard focus
// reveals a short explanation in the same chip voice as the chart tooltips.
function Hint({ text }: { text: string }) {
  return (
    <span className="group relative inline-block align-middle">
      <span
        tabIndex={0}
        role="img"
        aria-label={text}
        className="inline-flex h-[13px] w-[13px] items-center justify-center not-italic rounded-full border border-ink-faint/60 font-body text-[9px] leading-none text-ink-faint cursor-help select-none outline-none focus-visible:border-accent-text focus-visible:text-accent-text"
      >
        ?
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-[230px] -translate-x-1/2 border border-rule bg-white px-2.5 py-1.5 font-body not-italic text-[12px] leading-snug text-ink-soft shadow-[0_2px_10px_rgba(1,25,52,0.10)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

// Log-scaled slider: the thumb position is linear in ln(value), so ×0.5 and
// ×2 sit symmetrically around ×1.
function LogSlider({
  label,
  hint,
  value,
  min,
  max,
  format,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const t = (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min));
  return (
    <SliderRow
      label={label}
      hint={hint}
      display={format(value)}
      t={t}
      onChangeT={(nt) => onChange(Math.exp(Math.log(min) + nt * (Math.log(max) - Math.log(min))))}
    />
  );
}

function LinearSlider({
  label,
  hint,
  value,
  min,
  max,
  format,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <SliderRow
      label={label}
      hint={hint}
      display={format(value)}
      t={(value - min) / (max - min)}
      onChangeT={(nt) => onChange(min + nt * (max - min))}
    />
  );
}

function SliderRow({
  label,
  hint,
  display,
  t,
  onChangeT,
}: {
  label: string;
  hint: string;
  display: string;
  t: number;
  onChangeT: (t: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-display italic text-[13px] text-ink-soft">
          {label} <Hint text={hint} />
        </span>
        <span className="font-mono text-[12px] text-ink">{display}</span>
      </span>
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(t * 1000)}
        onChange={(e) => onChangeT(Number(e.target.value) / 1000)}
        className="mt-0.5 block w-full h-[14px] cursor-pointer"
        style={{ accentColor: "var(--accent)" }}
        aria-label={`${label}: ${display}`}
      />
    </label>
  );
}

export function ClassifierControls({
  params,
  onChange,
  onReset,
  onRerun,
  isDefault,
}: {
  params: ExplorerParams;
  onChange: (p: ExplorerParams) => void;
  onReset: () => void;
  onRerun: () => void;
  isDefault: boolean;
}) {
  const set = (patch: Partial<ExplorerParams>) => onChange({ ...params, ...patch });

  return (
    <div className="w-full max-w-[500px] mx-auto px-2 mt-3 pt-3 border-t border-rule">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 mb-2">
        <span className="font-display italic text-[14px] text-ink-faint">Classifier inputs</span>
        <span className="flex items-baseline gap-3">
          <button
            type="button"
            onClick={onRerun}
            className="font-display italic text-[13px] text-accent-text hover:underline cursor-pointer"
          >
            ↻ new draws
          </button>
          <span aria-hidden className="text-ink-faint text-[12px]">
            ·
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={isDefault}
            className={
              "font-display italic text-[13px] transition-colors " +
              (isDefault
                ? "text-ink-faint/50 cursor-default"
                : "text-accent-text hover:underline cursor-pointer")
            }
          >
            reset to paper values
          </button>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        <LogSlider
          label="Harm growth H₂/H₁"
          hint="How much total harm grew between the two periods. The paper estimates ≈2.4M → ≈4M harmful conversations, i.e. ×1.67."
          value={params.hMult}
          min={0.25}
          max={6}
          format={fmtMult}
          onChange={(v) => set({ hMult: v })}
        />
        <LogSlider
          label="Exposure growth E₂/E₁"
          hint="How much the opportunity for harm grew — conversations matching the monitoring question. The paper estimates ≈4M → ≈12M, i.e. ×3."
          value={params.eMult}
          min={0.25}
          max={6}
          format={fmtMult}
          onChange={(v) => set({ eMult: v })}
        />
        <LogSlider
          label="Harm uncertainty u_H"
          hint="How uncertain the two harm estimates are: the true value is taken to lie between ÷u and ×u of the estimate with 95% probability. Wider = more draws land as Unclassifiable."
          value={params.uH}
          min={1}
          max={8}
          format={fmtU}
          onChange={(v) => set({ uH: v })}
        />
        <LogSlider
          label="Exposure uncertainty u_E"
          hint="Same idea for the two exposure estimates: the true value lies between ÷u and ×u of the estimate with 95% probability."
          value={params.uE}
          min={1}
          max={8}
          format={fmtU}
          onChange={(v) => set({ uE: v })}
        />
        <LinearSlider
          label="Indifference band ε"
          hint="How big a trend must be before it counts as a real rise or fall. A draw whose trend falls inside the band is flat — and flat means Unclassifiable."
          value={params.eps}
          min={0}
          max={0.25}
          format={fmtEps}
          onChange={(v) => set({ eps: v })}
        />
      </div>
    </div>
  );
}

const FIELD =
  'h-11 w-full rounded-lg border border-border-strong bg-muted px-3 font-mono text-base outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** A measure in centimetres, typed as text so a comma works. */
export function SizeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold">
      {label}
      <input
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD}
      />
    </label>
  );
}

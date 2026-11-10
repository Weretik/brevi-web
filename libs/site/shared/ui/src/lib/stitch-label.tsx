import { cn } from './cn';

type StitchLabelProps = {
  /** Step number in mono, for example `01` or `404`. */
  index: string;
  children: string;
  className?: string;
};

/** Signature «Строчка» label: a number, a short dashed orange seam, and an uppercase caption in mono. */
export function StitchLabel({ index, children, className }: StitchLabelProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-[0.8125rem] font-semibold text-brand-text uppercase',
        className,
      )}
    >
      <span>{index}</span>
      <span aria-hidden className="w-12 border-t-2 border-dashed border-brand" />
      <span>{children}</span>
    </p>
  );
}

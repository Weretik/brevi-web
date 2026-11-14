import { cn } from '@site/shared/ui';

import type { ListingOption } from './catalog-listing-options';

/** The values of one filter as a column of choices; the chosen one is pressed. */
export function ListingChoices<T extends string>({
  label,
  options,
  value,
  onChange,
  wrap = false,
}: {
  label: string;
  options: readonly ListingOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  /** Chips in a row (the phone panel) instead of a column (the menu). */
  wrap?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex gap-2', wrap ? 'flex-wrap' : 'flex-col')}
    >
      {options.map((option) => {
        const on = option.value === value;
        return (
          <button
            key={option.value ?? 'any'}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex min-h-10 items-center rounded-full border px-4 text-left text-sm font-semibold whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              on
                ? 'border-foreground bg-foreground text-background'
                : 'border-border-strong bg-background hover:border-foreground',
              !wrap && 'justify-start rounded-lg',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

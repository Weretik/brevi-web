'use client';

import { ListingChoices } from './listing-choices';
import { ListingFilterMenu } from './listing-filter-menu';

import type { ListingOption } from './catalog-listing-options';

/** One filter chip of wider screens: its menu closes once a value is chosen. */
export function ListingFilterChip<T extends string>({
  label,
  chosen,
  options,
  value,
  onChange,
  align,
  title,
}: {
  label: string;
  chosen: string | null;
  options: readonly ListingOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  align?: 'start' | 'end';
  /** A heading above the choices in the menu. */
  title?: string;
}) {
  return (
    <div className="max-md:hidden">
      <ListingFilterMenu label={label} chosen={chosen} align={align}>
        {(close) => (
          <>
            {title ? <p className="text-sm font-bold">{title}</p> : null}
            <ListingChoices
              label={title ?? label}
              options={options}
              value={value}
              onChange={(next) => {
                onChange(next);
                close();
              }}
            />
          </>
        )}
      </ListingFilterMenu>
    </div>
  );
}

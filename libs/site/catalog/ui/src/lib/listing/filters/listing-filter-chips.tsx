'use client';

import { bandLabel } from './catalog-listing-options';
import { ListingChoices } from './listing-choices';
import { ListingFilterMenu } from './listing-filter-menu';

import type { ListingOption, ListingOptions, ListingText } from './catalog-listing-options';
import type { CatalogListingState } from '../use-catalog-listing';

/** One filter chip of wider screens: its menu closes once a value is chosen. */
function FilterChip<T extends string>({
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

/** Wider screens: a chip per filter, each with its own menu, the count found and the order. */
export function ListingFilterChips({
  listing,
  options,
  text,
}: {
  listing: CatalogListingState;
  options: ListingOptions;
  text: ListingText;
}) {
  const { choice, choose, filters, facets } = listing;
  const chosenBand = facets.bands.find((band) => band.key === choice.band);
  return (
    <>
      {facets.bands.length > 0 ? (
        <FilterChip
          label={text.price}
          title={text.priceTitle}
          chosen={chosenBand ? bandLabel(chosenBand, text) : null}
          options={options.bands}
          value={choice.band}
          onChange={(band) => choose({ band })}
        />
      ) : null}
      {facets.fabrics.length > 0 ? (
        <FilterChip
          label={text.fabric}
          chosen={choice.fabric}
          options={options.fabrics}
          value={choice.fabric}
          onChange={(fabric) => choose({ fabric })}
        />
      ) : null}
      {facets.types.length > 1 ? (
        <FilterChip
          label={text.type}
          chosen={choice.type ? text.types[choice.type] : null}
          options={options.types}
          value={choice.type}
          onChange={(type) => choose({ type })}
        />
      ) : null}
      {filters > 0 ? (
        <button
          type="button"
          onClick={() => choose({ type: null, band: null, fabric: null })}
          className="text-sm font-bold text-brand-text hover:underline max-md:hidden"
        >
          {text.reset}
        </button>
      ) : null}
      <span className="ml-auto">
        <span className="text-sm text-muted-foreground">
          {text.found} {listing.found}
        </span>
      </span>
      <FilterChip
        label={text.sort}
        chosen={choice.sort === 'default' ? null : text.sorts[choice.sort]}
        options={options.sorts}
        value={choice.sort}
        onChange={(sort) => choose({ sort: sort ?? 'default' })}
        align="end"
      />
    </>
  );
}

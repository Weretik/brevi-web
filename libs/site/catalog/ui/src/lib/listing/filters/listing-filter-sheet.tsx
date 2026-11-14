'use client';

import { EMPTY_CATALOG_CHOICE } from '@site/catalog/model';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  cn,
} from '@site/shared/ui';
import { SlidersHorizontalIcon } from 'lucide-react';

import { ListingChoices } from './listing-choices';

import type { ListingOption, ListingOptions, ListingText } from './catalog-listing-options';
import type { CatalogListingState } from '../use-catalog-listing';

/** One titled group of choices in the phone panel. */
function SheetGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly ListingOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
}) {
  return (
    <div className="grid gap-2 border-b border-border pb-4">
      <p className="text-sm font-bold">{title}</p>
      <ListingChoices wrap label={title} options={options} value={value} onChange={onChange} />
    </div>
  );
}

/** Phones: one button opens every filter and the order in a panel from the bottom. */
export function ListingFilterSheet({
  listing,
  options,
  text,
}: {
  listing: CatalogListingState;
  options: ListingOptions;
  text: ListingText;
}) {
  const { choice, choose, filters, facets } = listing;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'min-h-10 rounded-full md:hidden',
            filters > 0 && 'border-foreground bg-foreground text-background hover:bg-foreground',
          )}
        >
          <SlidersHorizontalIcon aria-hidden />
          {filters > 0 ? `${text.filters} · ${filters}` : text.filters}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel={text.close}>
        <SheetTitle className="text-lg font-extrabold">{text.filtersTitle}</SheetTitle>
        <SheetDescription>{text.filtersTitle}</SheetDescription>
        <SheetGroup
          title={text.sort}
          options={options.sorts}
          value={choice.sort}
          onChange={(sort) => choose({ sort: sort ?? 'default' })}
        />
        {facets.bands.length > 0 ? (
          <SheetGroup
            title={text.priceTitle}
            options={options.bands}
            value={choice.band}
            onChange={(band) => choose({ band })}
          />
        ) : null}
        {facets.fabrics.length > 0 ? (
          <SheetGroup
            title={text.fabric}
            options={options.fabrics}
            value={choice.fabric}
            onChange={(fabric) => choose({ fabric })}
          />
        ) : null}
        {facets.types.length > 1 ? (
          <SheetGroup
            title={text.type}
            options={options.types}
            value={choice.type}
            onChange={(type) => choose({ type })}
          />
        ) : null}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => choose(EMPTY_CATALOG_CHOICE)}
            disabled={filters === 0 && choice.sort === 'default'}
          >
            {text.reset}
          </Button>
          <SheetClose asChild>
            <Button variant="brand" size="lg" className="flex-1">
              {text.show} {listing.found}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

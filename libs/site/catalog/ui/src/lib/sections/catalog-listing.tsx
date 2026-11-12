'use client';

import {
  CATALOG_SORTS,
  EMPTY_CATALOG_CHOICE,
  applyCatalogChoice,
  catalogPriceBands,
  countCatalogFilters,
  readCatalogChoice,
  writeCatalogChoice,
} from '@site/catalog/model';
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
import { ChevronDownIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { CatalogProductTile } from './catalog-product-tile';
import { formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type {
  CatalogListingChoice,
  CatalogPriceBand,
  CatalogProductCard,
  CatalogProductType,
  CatalogSort,
} from '@site/catalog/model';
import type { ReactNode, RefObject } from 'react';

/** A product of the listing with the address of its page, worked out on the server. */
export type CatalogListingItem = { product: CatalogProductCard; href: string };

/** Cards shown at first and added by each «Показати ще». */
const PAGE_SIZE = 24;
const EAGER_CARDS = 4;

type Option<T extends string> = { value: T | null; label: string };
type ListingText = CatalogDictionary['listing'];

function bandLabel(band: CatalogPriceBand, text: ListingText): string {
  if (band.min === null) return `${text.priceUpTo} ${formatPrice(band.max ?? 0)}`;
  if (band.max === null) return `${text.priceOver} ${formatPrice(band.min)}`;
  return `${formatPrice(band.min)} – ${formatPrice(band.max)}`;
}

/** Closes an open menu on Escape and on a press outside of it. */
function useDismiss(rootRef: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [rootRef, open, close]);
}

/** The values of one filter as a column of choices; the chosen one is pressed. */
function Choices<T extends string>({
  label,
  options,
  value,
  onChange,
  wrap = false,
}: {
  label: string;
  options: readonly Option<T>[];
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

/** A chip above the listing that opens the values of one filter; it names the chosen value. */
function FilterMenu({
  label,
  chosen,
  align = 'start',
  children,
}: {
  label: string;
  /** Text of the chosen value, or `null` while the filter is off. */
  chosen: string | null;
  align?: 'start' | 'end';
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-bold whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          chosen === null
            ? 'border-border-strong bg-background hover:border-foreground'
            : 'border-brand-soft bg-brand-surface text-brand-text',
        )}
      >
        {chosen === null ? label : `${label}: ${chosen}`}
        <ChevronDownIcon aria-hidden className="size-4" strokeWidth={2} />
      </button>
      {open ? (
        <div
          id={panelId}
          className={cn(
            'absolute top-12 z-30 grid w-64 gap-3 rounded-xl border border-border-strong bg-background p-3 shadow-lg',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The products of a category with the row above them: price ranges, own sewing or protective equipment
 * (only when the category has both), and the order. Every card stays in the page for search engines; the
 * filters and «Показати ще» only hide some. The choice is kept in the address (`?price=…&sort=…`) so a
 * link opens the same view; the page itself is the same for every address.
 */
export function CatalogListing({
  items,
  products,
  text,
  requestHref,
}: {
  items: readonly CatalogListingItem[];
  products: CatalogDictionary['products'];
  text: ListingText;
  requestHref: string;
}) {
  const bands = useMemo(
    () => catalogPriceBands(items.map((item) => item.product.priceFrom)),
    [items],
  );
  const types = useMemo(
    () => [...new Set(items.map((item) => item.product.type))] as CatalogProductType[],
    [items],
  );
  const [choice, setChoice] = useState<CatalogListingChoice>(EMPTY_CATALOG_CHOICE);
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    setChoice(readCatalogChoice(new URLSearchParams(window.location.search), bands));
  }, [bands]);

  const choose = (change: Partial<CatalogListingChoice>) => {
    const next = { ...choice, ...change };
    setChoice(next);
    setLimit(PAGE_SIZE);
    const query = writeCatalogChoice(new URLSearchParams(window.location.search), next).toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}`,
    );
  };

  const shown = useMemo(
    () =>
      applyCatalogChoice(
        items.map((item) => ({
          ...item,
          type: item.product.type,
          priceFrom: item.product.priceFrom,
        })),
        choice,
        bands,
      ),
    [items, choice, bands],
  );
  const visible = new Set(shown.slice(0, limit).map((item) => item.product.slug));
  // The shown cards in their order, then the rest hidden, so every product link stays in the page.
  const shownSlugs = new Set(shown.map((item) => item.product.slug));
  const hiddenRest = items.filter((item) => !shownSlugs.has(item.product.slug));

  const bandOptions: Option<string>[] = [
    { value: null, label: text.any },
    ...bands.map((band) => ({ value: band.key, label: bandLabel(band, text) })),
  ];
  const typeOptions: Option<CatalogProductType>[] = [
    { value: null, label: text.anyType },
    ...types.map((type) => ({ value: type, label: text.types[type] })),
  ];
  const sortOptions: Option<CatalogSort>[] = CATALOG_SORTS.map((sort) => ({
    value: sort,
    label: text.sorts[sort],
  }));
  const chosenBand = bands.find((band) => band.key === choice.band);
  const filters = countCatalogFilters(choice);
  const hasBands = bands.length > 0;
  const hasTypes = types.length > 1;
  const found = (
    <span className="text-sm text-muted-foreground">
      {text.found} {shown.length}
    </span>
  );

  return (
    <div className="grid gap-4">
      <div className="sticky top-15 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0 lg:top-14">
        {/* Phones: one button opens every filter and the order in a panel from the bottom. */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'min-h-10 rounded-full md:hidden',
                filters > 0 &&
                  'border-foreground bg-foreground text-background hover:bg-foreground',
              )}
            >
              <SlidersHorizontalIcon aria-hidden />
              {filters > 0 ? `${text.filters} · ${filters}` : text.filters}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" closeLabel={text.close}>
            <SheetTitle className="text-lg font-extrabold">{text.filtersTitle}</SheetTitle>
            <SheetDescription>{text.filtersTitle}</SheetDescription>
            <div className="grid gap-2 border-b border-border pb-4">
              <p className="text-sm font-bold">{text.sort}</p>
              <Choices
                wrap
                label={text.sort}
                options={sortOptions}
                value={choice.sort}
                onChange={(sort) => choose({ sort: sort ?? 'default' })}
              />
            </div>
            {hasBands ? (
              <div className="grid gap-2 border-b border-border pb-4">
                <p className="text-sm font-bold">{text.priceTitle}</p>
                <Choices
                  wrap
                  label={text.priceTitle}
                  options={bandOptions}
                  value={choice.band}
                  onChange={(band) => choose({ band })}
                />
              </div>
            ) : null}
            {hasTypes ? (
              <div className="grid gap-2 border-b border-border pb-4">
                <p className="text-sm font-bold">{text.type}</p>
                <Choices
                  wrap
                  label={text.type}
                  options={typeOptions}
                  value={choice.type}
                  onChange={(type) => choose({ type })}
                />
              </div>
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
                  {text.show} {shown.length}
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        {/* Wider screens: a chip per filter, each with its own menu. */}
        {hasBands ? (
          <div className="max-md:hidden">
            <FilterMenu label={text.price} chosen={chosenBand ? bandLabel(chosenBand, text) : null}>
              {(close) => (
                <>
                  <p className="text-sm font-bold">{text.priceTitle}</p>
                  <Choices
                    label={text.priceTitle}
                    options={bandOptions}
                    value={choice.band}
                    onChange={(band) => {
                      choose({ band });
                      close();
                    }}
                  />
                </>
              )}
            </FilterMenu>
          </div>
        ) : null}
        {hasTypes ? (
          <div className="max-md:hidden">
            <FilterMenu label={text.type} chosen={choice.type ? text.types[choice.type] : null}>
              {(close) => (
                <Choices
                  label={text.type}
                  options={typeOptions}
                  value={choice.type}
                  onChange={(type) => {
                    choose({ type });
                    close();
                  }}
                />
              )}
            </FilterMenu>
          </div>
        ) : null}
        {filters > 0 ? (
          <button
            type="button"
            onClick={() => choose({ type: null, band: null })}
            className="text-sm font-bold text-brand-text hover:underline max-md:hidden"
          >
            {text.reset}
          </button>
        ) : null}
        <span className="ml-auto">{found}</span>
        <div className="max-md:hidden">
          <FilterMenu
            label={text.sort}
            chosen={choice.sort === 'default' ? null : text.sorts[choice.sort]}
            align="end"
          >
            {(close) => (
              <Choices
                label={text.sort}
                options={sortOptions}
                value={choice.sort}
                onChange={(sort) => {
                  choose({ sort: sort ?? 'default' });
                  close();
                }}
              />
            )}
          </FilterMenu>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="max-w-[48rem] leading-relaxed text-muted-foreground">{text.nothing}</p>
      ) : null}

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...shown, ...hiddenRest].map((item, index) => (
          <CatalogProductTile
            key={item.product.slug}
            product={item.product}
            href={item.href}
            dictionary={products}
            requestHref={requestHref}
            eager={index < EAGER_CARDS}
            hidden={!visible.has(item.product.slug)}
          />
        ))}
      </ul>

      {shown.length > limit ? (
        <Button
          variant="outline"
          size="lg"
          className="justify-self-center"
          onClick={() => setLimit((value) => value + PAGE_SIZE)}
        >
          {text.showMore} ({Math.min(PAGE_SIZE, shown.length - limit)})
        </Button>
      ) : null}
    </div>
  );
}

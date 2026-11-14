'use client';

import {
  EMPTY_CATALOG_CHOICE,
  applyCatalogChoice,
  catalogFabrics,
  catalogPriceBands,
  countCatalogFilters,
  readCatalogChoice,
  writeCatalogChoice,
} from '@site/catalog/model';
import { useEffect, useMemo, useState } from 'react';

import type { CatalogListingItem } from './catalog-listing-item';
import type { CatalogListingChoice, CatalogProductType } from '@site/catalog/model';

/** Cards shown at first and added by each «Показати ще». */
export const LISTING_PAGE_SIZE = 24;

/**
 * The state of a listing: what it can filter by, the visitor's choice (read from and written to the
 * address), the shown cards in their order and how many of them are open.
 */
export function useCatalogListing(items: readonly CatalogListingItem[]) {
  const bands = useMemo(
    () => catalogPriceBands(items.map((item) => item.product.priceFrom)),
    [items],
  );
  const fabrics = useMemo(() => catalogFabrics(items.map((item) => item.product)), [items]);
  const types = useMemo(
    () => [...new Set(items.map((item) => item.product.type))] as CatalogProductType[],
    [items],
  );
  const [choice, setChoice] = useState<CatalogListingChoice>(EMPTY_CATALOG_CHOICE);
  const [limit, setLimit] = useState(LISTING_PAGE_SIZE);

  useEffect(() => {
    setChoice(readCatalogChoice(new URLSearchParams(window.location.search), { bands, fabrics }));
  }, [bands, fabrics]);

  const choose = (change: Partial<CatalogListingChoice>) => {
    const next = { ...choice, ...change };
    setChoice(next);
    setLimit(LISTING_PAGE_SIZE);
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
          fabrics: item.product.fabrics,
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

  return {
    facets: { bands, fabrics, types },
    choice,
    choose,
    filters: countCatalogFilters(choice),
    found: shown.length,
    ordered: [...shown, ...hiddenRest] as CatalogListingItem[],
    isOpen: (item: CatalogListingItem) => visible.has(item.product.slug),
    more: shown.length > limit ? Math.min(LISTING_PAGE_SIZE, shown.length - limit) : 0,
    showMore: () => setLimit((value) => value + LISTING_PAGE_SIZE),
  };
}

export type CatalogListingState = ReturnType<typeof useCatalogListing>;

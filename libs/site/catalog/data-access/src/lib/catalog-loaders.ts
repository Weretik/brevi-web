import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAG, CATALOG_LIFE, FAILURE_LIFE } from './catalog-cache';
import {
  mapCatalogAddresses,
  mapCatalogCardPage,
  mapCatalogProduct,
  mapCatalogTree,
} from './mappers/public-catalog.mapper';

import type {
  CatalogProduct,
  CatalogProductAddress,
  CatalogProductCard,
  CatalogProductType,
  CatalogTreeNode,
} from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ApiResult, PublicGetPath, SiteApiQuery } from '@site/shared/api-client';

const CARDS_PAGE_SIZE = 100;
/** A listing shows every product of a category on one page; this is a guard, not a limit anyone meets. */
const MAX_CARD_PAGES = 20;

/** An answer of the right shape, or `null` when the API is unavailable or answered something else. */
async function read<T>(
  path: PublicGetPath,
  query: SiteApiQuery,
  map: (data: unknown) => T,
): Promise<{ kind: 'ok'; data: T } | { kind: 'not-found' } | null> {
  const result: ApiResult = await siteApiGet(path, query);
  if (result.kind === 'not-found') return result;
  if (result.kind !== 'ok') return null;
  try {
    return { kind: 'ok', data: map(result.data) };
  } catch {
    return null;
  }
}

/** The catalog tree; `null` when the API is unavailable. */
export async function loadCatalogTree(): Promise<CatalogTreeNode[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const result = await read('/api/public/catalog/tree', {}, mapCatalogTree);
  if (result?.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(CATALOG_LIFE);
  return result.data;
}

/** Every product card of a type or of one section, in the order of the Admin; `null` when unavailable. */
export async function loadCatalogCards(
  locale: Locale,
  type: CatalogProductType,
  sectionId: number | null,
): Promise<CatalogProductCard[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const cards: CatalogProductCard[] = [];
  for (let page = 1; page <= MAX_CARD_PAGES; page += 1) {
    const result = await read(
      '/api/public/catalog/products',
      { language: locale, type, sectionId, page, pageSize: CARDS_PAGE_SIZE },
      mapCatalogCardPage,
    );
    if (result?.kind !== 'ok') {
      cacheLife(FAILURE_LIFE);
      return null;
    }
    cards.push(...result.data.items);
    if (cards.length >= result.data.total || result.data.items.length === 0) break;
  }
  cacheLife(CATALOG_LIFE);
  return cards;
}

/** A product page; `'not-found'` when the site does not show such a product, `null` when unavailable. */
export async function loadCatalogProduct(
  slug: string,
  locale: Locale,
): Promise<CatalogProduct | 'not-found' | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const result = await read(
    `/api/public/catalog/products/${encodeURIComponent(slug)}`,
    { language: locale },
    mapCatalogProduct,
  );
  if (!result) {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(CATALOG_LIFE);
  return result.kind === 'ok' ? result.data : 'not-found';
}

/** Addresses of every product on the site; `null` when unavailable. */
export async function loadCatalogAddresses(): Promise<CatalogProductAddress[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const result = await read('/api/public/catalog/product-slugs', {}, mapCatalogAddresses);
  if (result?.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(CATALOG_LIFE);
  return result.data;
}

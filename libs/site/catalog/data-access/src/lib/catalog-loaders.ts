import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAG, CATALOG_LIFE, FAILURE_LIFE } from './catalog-cache';
import {
  mapCatalogAddresses,
  mapCatalogCardPage,
  mapCatalogCategoryText,
  mapCatalogProduct,
  mapCatalogTree,
} from './mappers/public-catalog.mapper';

import type {
  CatalogCategoryPage,
  CatalogProduct,
  CatalogProductAddress,
  CatalogProductCard,
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

  const result = await read('/api/public/catalog/categories', {}, mapCatalogTree);
  if (result?.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(CATALOG_LIFE);
  return result.data;
}

/**
 * Every product card of a category with its subcategories, in the order of the category; `null` when
 * unavailable or when the site does not show such a category.
 */
export async function loadCatalogCards(
  locale: Locale,
  category: string,
): Promise<CatalogProductCard[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const cards: CatalogProductCard[] = [];
  for (let page = 1; page <= MAX_CARD_PAGES; page += 1) {
    const result = await read(
      '/api/public/catalog/products',
      { language: locale, category, page, pageSize: CARDS_PAGE_SIZE },
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

/** What staff wrote about a category in the language of the page; `null` when unavailable or not shown. */
export async function loadCatalogCategoryText(
  slug: string,
  locale: Locale,
): Promise<Pick<CatalogCategoryPage, 'name' | 'textLocale' | 'seo' | 'text'> | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const result = await read(
    `/api/public/catalog/categories/${encodeURIComponent(slug)}`,
    { language: locale },
    mapCatalogCategoryText,
  );
  if (result?.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(CATALOG_LIFE);
  return result.data;
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

/** Addresses of every product or of every category on the site; `null` when unavailable. */
export async function loadCatalogAddresses(
  of: 'product' | 'category',
): Promise<CatalogProductAddress[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAG);

  const result = await read(`/api/public/catalog/${of}-slugs`, {}, mapCatalogAddresses);
  if (result?.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }
  cacheLife(CATALOG_LIFE);
  return result.data;
}

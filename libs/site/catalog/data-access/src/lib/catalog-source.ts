import { findCatalogPath, flattenCatalogTree } from '@site/catalog/model';

import {
  loadCatalogAddresses,
  loadCatalogCards,
  loadCatalogProduct,
  loadCatalogTree,
} from './catalog-loaders';

import type {
  CatalogCategory,
  CatalogProduct,
  CatalogProductAddress,
  CatalogProductCard,
  CatalogTreeNode,
} from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Catalog data for server components, read from the BreviERP public catalog API: only the products that
 * staff marked «Показувати на сайті» in the Admin. When the API is unavailable the catalog is empty and a
 * product is «not found»; the answer is kept for a minute, so the site recovers on its own.
 */
export async function getCatalogTree(): Promise<readonly CatalogTreeNode[]> {
  return (await loadCatalogTree()) ?? [];
}

export async function getCatalogCategory(slug: string): Promise<CatalogCategory | null> {
  const trail = findCatalogPath(slug, await getCatalogTree());
  const node = trail?.at(-1);
  return trail && node ? { node, trail } : null;
}

export async function getCatalogCategorySlugs(): Promise<readonly string[]> {
  return flattenCatalogTree(await getCatalogTree()).map((node) => node.slug);
}

/** Products of a product type or of a section, in the order of the Admin. */
export async function getCatalogCategoryProducts(
  node: Pick<CatalogTreeNode, 'productType' | 'sectionId'>,
  locale: Locale,
): Promise<readonly CatalogProductCard[]> {
  return (await loadCatalogCards(locale, node.productType, node.sectionId)) ?? [];
}

export async function getCatalogProduct(
  slug: string,
  locale: Locale,
): Promise<CatalogProduct | null> {
  const product = await loadCatalogProduct(slug, locale);
  return product === 'not-found' ? null : product;
}

export async function getCatalogProductAddresses(): Promise<readonly CatalogProductAddress[]> {
  return (await loadCatalogAddresses()) ?? [];
}

/** The category a product belongs to: its section, or its product type when it has no section on the site. */
export async function getCatalogProductCategory(
  product: Pick<CatalogProduct, 'type' | 'sectionId'>,
): Promise<CatalogCategory | null> {
  const type = (await getCatalogTree()).find((node) => node.productType === product.type);
  if (!type) return null;
  const section = type.children.find((node) => node.sectionId === product.sectionId);
  return section ? { node: section, trail: [type, section] } : { node: type, trail: [type] };
}

/** Other models of the product's own category, in listing order, for the «more models» block. */
export async function getCatalogRelatedProducts(
  product: Pick<CatalogProduct, 'slug' | 'type' | 'sectionId'>,
  locale: Locale,
  limit: number,
): Promise<readonly CatalogProductCard[]> {
  const cards = await getCatalogCategoryProducts(
    { productType: product.type, sectionId: product.sectionId },
    locale,
  );
  const others = cards.filter((card) => card.slug !== product.slug);
  const start = Math.max(
    0,
    cards.findIndex((card) => card.slug === product.slug),
  );
  // Start after the product itself and wrap around, so each page links to different neighbours.
  return [...others.slice(start), ...others.slice(0, start)].slice(0, limit);
}

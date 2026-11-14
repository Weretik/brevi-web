import { findCatalogPath, flattenCatalogTree } from '@site/catalog/model';

import {
  loadCatalogAddresses,
  loadCatalogCards,
  loadCatalogCategoryText,
  loadCatalogProduct,
  loadCatalogTree,
} from './catalog-loaders';

import type {
  CatalogCategory,
  CatalogCategoryPage,
  CatalogProduct,
  CatalogProductAddress,
  CatalogProductCard,
  CatalogTreeNode,
} from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Catalog data for server components, read from the BreviERP public catalog API: the categories staff keep
 * in «Контент → Розділи сайту» and the products marked «Показувати на сайті». When the API is unavailable
 * the catalog is empty and a product is «not found»; the answer is kept for a minute, so the site recovers
 * on its own.
 */
export async function getCatalogTree(): Promise<readonly CatalogTreeNode[]> {
  return (await loadCatalogTree()) ?? [];
}

/**
 * A category page: its place in the tree with the SEO and the text staff wrote. While only the texts are
 * unavailable the page still opens with the name from the tree.
 */
export async function getCatalogCategory(
  slug: string,
  locale: Locale,
): Promise<CatalogCategoryPage | null> {
  const trail = findCatalogPath(slug, await getCatalogTree());
  const node = trail?.at(-1);
  if (!trail || !node) return null;
  const written = await loadCatalogCategoryText(slug, locale);
  return {
    node,
    trail,
    ...(written ?? {
      name: node.name[locale],
      textLocale: locale,
      seo: { title: '', description: '' },
      text: [],
    }),
  };
}

export async function getCatalogCategorySlugs(): Promise<readonly string[]> {
  return flattenCatalogTree(await getCatalogTree()).map((node) => node.slug);
}

/** Addresses of the categories for the sitemap, each with whether it has Russian texts. */
export async function getCatalogCategoryAddresses(): Promise<readonly CatalogProductAddress[]> {
  return (await loadCatalogAddresses('category')) ?? [];
}

/** Products of a category and of its subcategories, in the order of the category. */
export async function getCatalogCategoryProducts(
  slug: string,
  locale: Locale,
): Promise<readonly CatalogProductCard[]> {
  return (await loadCatalogCards(locale, slug)) ?? [];
}

/** Every product the site shows, in the order of the Admin list (own sewing first); empty when unavailable. */
export async function getCatalogProducts(locale: Locale): Promise<readonly CatalogProductCard[]> {
  return (await loadCatalogCards(locale)) ?? [];
}

export async function getCatalogProduct(
  slug: string,
  locale: Locale,
): Promise<CatalogProduct | null> {
  const product = await loadCatalogProduct(slug, locale);
  return product === 'not-found' ? null : product;
}

export async function getCatalogProductAddresses(): Promise<readonly CatalogProductAddress[]> {
  return (await loadCatalogAddresses('product')) ?? [];
}

/**
 * The category the breadcrumbs of a product lead through: its first subcategory, or its first category
 * when it is in no subcategory; `null` for a product staff put in no category.
 */
export async function getCatalogProductCategory(
  product: Pick<CatalogProduct, 'categories'>,
): Promise<CatalogCategory | null> {
  const own = product.categories.find((category) => category.parent) ?? product.categories[0];
  const trail = own ? findCatalogPath(own.slug, await getCatalogTree()) : null;
  const node = trail?.at(-1);
  return trail && node ? { node, trail } : null;
}

/** Other models of the product's own category, in listing order, for the «more models» block. */
export async function getCatalogRelatedProducts(
  product: Pick<CatalogProduct, 'slug' | 'categories'>,
  locale: Locale,
  limit: number,
): Promise<readonly CatalogProductCard[]> {
  const category = await getCatalogProductCategory(product);
  if (!category) return [];
  const cards = await getCatalogCategoryProducts(category.node.slug, locale);
  const others = cards.filter((card) => card.slug !== product.slug);
  const start = Math.max(
    0,
    cards.findIndex((card) => card.slug === product.slug),
  );
  // Start after the product itself and wrap around, so each page links to different neighbours.
  return [...others.slice(start), ...others.slice(0, start)].slice(0, limit);
}

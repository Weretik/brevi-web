import type { CatalogLocalized } from './catalog-tree';
import type { Locale } from '@site/core/i18n';

/** A block of the text about a category, in the order the client wrote it. */
export type CatalogTextBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string; /** Bold opening such as «Тканина:». */ lead?: string }
  | { type: 'list'; items: readonly string[] };

/** A category page: names, search snippet, the text under the listing, and its products in listing order. */
export type CatalogCategory = {
  slug: string;
  parentSlug: string | null;
  name: CatalogLocalized;
  seo: Record<Locale, { title: string; description: string }>;
  text: Record<Locale, readonly CatalogTextBlock[]>;
  productSlugs: readonly string[];
};

/** What a listing card shows about a product. Prices are not part of the snapshot. */
export type CatalogProductCard = {
  slug: string;
  name: CatalogLocalized;
  /** Photo in `apps/site/public`; `null` when the product has none. */
  image: { src: string; width: number; height: number } | null;
};

import type { CatalogProductType, CatalogTreeNode } from './catalog-tree';
import type { Locale } from '@site/core/i18n';

/** A block of text, in the order staff wrote it. */
export type CatalogTextBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string; /** Bold opening such as «Тканина:». */ lead?: string }
  | { type: 'list'; items: readonly string[] };

/** A category in the tree: its node and the way to it from the top level. */
export type CatalogCategory = {
  node: CatalogTreeNode;
  /** From the top-level category down to the category itself. */
  trail: readonly CatalogTreeNode[];
};

/** A category page in the language of the page: its place in the tree and what staff wrote about it. */
export type CatalogCategoryPage = CatalogCategory & {
  name: string;
  /** Language of the texts: a category without Russian texts shows the Ukrainian ones on the Russian page. */
  textLocale: Locale;
  /** Title and description for search as staff wrote them; empty when they did not. */
  seo: { title: string; description: string };
  text: readonly CatalogTextBlock[];
};

/** What a listing card shows about a product, in the language of the page. */
export type CatalogProductCard = {
  slug: string;
  /** Own sewing or resold protective equipment. */
  type: CatalogProductType;
  /** Model or article number the manager knows the product by. */
  code: string | null;
  name: string;
  /** Address of the photo on the media server; `null` when the product has none. */
  image: string | null;
  /** The lowest price in hryvnias (large wholesale); `null` when a manager quotes the price. */
  priceFrom: number | null;
  /** Names of the fabrics a sewing model is made in, each once; empty for protective equipment. */
  fabrics: readonly string[];
};

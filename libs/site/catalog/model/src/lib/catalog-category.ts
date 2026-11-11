import type { CatalogTreeNode } from './catalog-tree';

/** A block of text, in the order staff wrote it. */
export type CatalogTextBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string; /** Bold opening such as «Тканина:». */ lead?: string }
  | { type: 'list'; items: readonly string[] };

/** A category page: its node of the tree and the way to it from the product type. */
export type CatalogCategory = {
  node: CatalogTreeNode;
  /** From the product type down to the category itself. */
  trail: readonly CatalogTreeNode[];
};

/** What a listing card shows about a product, in the language of the page. */
export type CatalogProductCard = {
  slug: string;
  name: string;
  /** Address of the photo on the media server; `null` when the product has none. */
  image: string | null;
  /** The lowest price in hryvnias (large wholesale); `null` when a manager quotes the price. */
  priceFrom: number | null;
};

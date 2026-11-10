import { CATALOG_TREE_DATA } from './data/catalog-tree';

import type { Locale } from '@site/core/i18n';

export type CatalogLocalized = Record<Locale, string>;

/** One category in the catalog tree: enough for menus, breadcrumbs, and links. */
export type CatalogTreeNode = {
  /** One slug in both languages; the category URL is `/catalog/{slug}`. */
  slug: string;
  name: CatalogLocalized;
  /** Products of the category together with its subcategories. */
  productCount: number;
  children: readonly CatalogTreeNode[];
};

/** Category tree of the catalog: sections, subsections, and (for footwear) one more level. */
export const CATALOG_TREE: readonly CatalogTreeNode[] = CATALOG_TREE_DATA;

/** Categories from a section down to `slug`, or `null` when there is no such category. */
export function findCatalogPath(
  slug: string,
  nodes: readonly CatalogTreeNode[] = CATALOG_TREE,
): readonly CatalogTreeNode[] | null {
  for (const node of nodes) {
    if (node.slug === slug) return [node];
    const rest = findCatalogPath(slug, node.children);
    if (rest) return [node, ...rest];
  }
  return null;
}

/** Every category of the tree in menu order, parents before children. */
export function flattenCatalogTree(
  nodes: readonly CatalogTreeNode[] = CATALOG_TREE,
): readonly CatalogTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenCatalogTree(node.children)]);
}

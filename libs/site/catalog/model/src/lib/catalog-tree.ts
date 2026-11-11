import type { Locale } from '@site/core/i18n';

export type CatalogLocalized = Record<Locale, string>;

/** The two kinds of products the Admin keeps: own sewing and resold protective equipment. */
export type CatalogProductType = 'Sewing' | 'Ppe';

/**
 * One category in the catalog tree: enough for menus, breadcrumbs, and links. The upper level is the two
 * product types; under each are the sections of «Типи і розділи» of the Admin that have products on the site.
 */
export type CatalogTreeNode = {
  /** One slug in both languages; the category URL is `/catalog/{slug}`. */
  slug: string;
  name: CatalogLocalized;
  /** Products of the category together with its subcategories. */
  productCount: number;
  productType: CatalogProductType;
  /** Section id in the Admin; `null` for a product type. */
  sectionId: number | null;
  children: readonly CatalogTreeNode[];
};

/** Categories from a product type down to `slug`, or `null` when there is no such category. */
export function findCatalogPath(
  slug: string,
  nodes: readonly CatalogTreeNode[],
): readonly CatalogTreeNode[] | null {
  for (const node of nodes) {
    if (node.slug === slug) return [node];
    const rest = findCatalogPath(slug, node.children);
    if (rest) return [node, ...rest];
  }
  return null;
}

/** Every category of the tree in menu order, parents before children. */
export function flattenCatalogTree(nodes: readonly CatalogTreeNode[]): readonly CatalogTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenCatalogTree(node.children)]);
}

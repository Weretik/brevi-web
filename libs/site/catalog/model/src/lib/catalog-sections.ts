import type { CatalogLocalized, CatalogTreeNode } from './catalog-tree';

export type CatalogSection = {
  /** The category slug; also the key of the section icon. */
  key: string;
  slug: string;
  label: CatalogLocalized;
  items: readonly { key: string; slug: string; label: CatalogLocalized }[];
};

/** Sections and subsections for the header mega menu, the footer, and the home page: two levels of the tree. */
export function toCatalogSections(tree: readonly CatalogTreeNode[]): readonly CatalogSection[] {
  return tree.map((section) => ({
    key: section.slug,
    slug: section.slug,
    label: section.name,
    items: section.children.map((item) => ({ key: item.slug, slug: item.slug, label: item.name })),
  }));
}

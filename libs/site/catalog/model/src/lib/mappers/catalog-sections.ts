import { catalogCategoryPath } from '@site/core/i18n';

import type { CatalogLocalized, CatalogTreeNode } from '../entities/catalog-tree';

/** A subsection of the menu; `path` (locale-free) when it is not a catalog category, for example a city page. */
export type CatalogSectionItem = {
  key: string;
  slug: string;
  label: CatalogLocalized;
  path?: string;
};

export type CatalogSection = {
  /** The category slug; also the key of the section icon. */
  key: string;
  slug: string;
  label: CatalogLocalized;
  items: readonly CatalogSectionItem[];
  /** Locale-free page of the whole section when it is not a catalog category, with its link text. */
  path?: string;
  allLabel?: CatalogLocalized;
};

/** Locale-free page of a menu section or subsection: its own `path`, otherwise its catalog category. */
export function catalogSectionPath(entry: { slug: string; path?: string }): string {
  return entry.path ?? catalogCategoryPath(entry.slug);
}

/** Sections and subsections for the header mega menu, the footer, and the home page: two levels of the tree. */
export function toCatalogSections(tree: readonly CatalogTreeNode[]): readonly CatalogSection[] {
  return tree.map((section) => ({
    key: section.slug,
    slug: section.slug,
    label: section.name,
    items: section.children.map((item) => ({ key: item.slug, slug: item.slug, label: item.name })),
  }));
}

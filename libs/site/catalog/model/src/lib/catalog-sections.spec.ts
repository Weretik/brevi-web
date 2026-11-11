import { toCatalogSections } from './catalog-sections';
import { findCatalogPath, flattenCatalogTree } from './catalog-tree';
import { CATALOG_TYPES } from './catalog-types';

import type { CatalogTreeNode } from './catalog-tree';

const section = (slug: string, sectionId: number): CatalogTreeNode => ({
  slug,
  name: { uk: slug, ru: slug },
  productCount: 2,
  productType: 'Sewing',
  sectionId,
  children: [],
});

const tree: CatalogTreeNode[] = [
  {
    ...CATALOG_TYPES.Sewing,
    productCount: 4,
    productType: 'Sewing',
    sectionId: null,
    children: [section('kostyumy', 10), section('kurtky', 11)],
  },
];

describe('catalog tree', () => {
  it('names the two product types in both languages with different addresses', () => {
    const types = Object.values(CATALOG_TYPES);

    expect(new Set(types.map((type) => type.slug)).size).toBe(2);
    for (const type of types) {
      expect(type.slug).toMatch(/^[a-z0-9-]+$/);
      expect(type.name.uk.trim()).not.toBe('');
      expect(type.name.ru.trim()).not.toBe('');
    }
  });

  it('finds the path from a product type to a section', () => {
    expect(findCatalogPath('kurtky', tree)?.map((node) => node.slug)).toEqual([
      'spetsodyah',
      'kurtky',
    ]);
    expect(findCatalogPath('no-such-category', tree)).toBeNull();
    expect(flattenCatalogTree(tree).map((node) => node.slug)).toEqual([
      'spetsodyah',
      'kostyumy',
      'kurtky',
    ]);
  });

  it('exposes the two upper levels as menu sections', () => {
    expect(toCatalogSections(tree)).toEqual([
      {
        key: 'spetsodyah',
        slug: 'spetsodyah',
        label: CATALOG_TYPES.Sewing.name,
        items: [
          { key: 'kostyumy', slug: 'kostyumy', label: { uk: 'kostyumy', ru: 'kostyumy' } },
          { key: 'kurtky', slug: 'kurtky', label: { uk: 'kurtky', ru: 'kurtky' } },
        ],
      },
    ]);
  });
});

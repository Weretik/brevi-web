import { toCatalogSections } from './catalog-sections';
import { findCatalogPath, flattenCatalogTree } from './catalog-tree';

import type { CatalogTreeNode } from './catalog-tree';

const section = (slug: string): CatalogTreeNode => ({
  slug,
  name: { uk: slug, ru: slug },
  productCount: 2,
  children: [],
});
const clothes = { uk: 'Спецодяг', ru: 'Спецодежда' };

const tree: CatalogTreeNode[] = [
  {
    slug: 'spetsodyah',
    name: clothes,
    productCount: 4,
    children: [section('kostyumy'), section('kurtky')],
  },
];

describe('catalog tree', () => {
  it('finds the path from a category to a subcategory', () => {
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
        label: clothes,
        items: [
          { key: 'kostyumy', slug: 'kostyumy', label: { uk: 'kostyumy', ru: 'kostyumy' } },
          { key: 'kurtky', slug: 'kurtky', label: { uk: 'kurtky', ru: 'kurtky' } },
        ],
      },
    ]);
  });
});

import { CATALOG_SECTIONS } from './catalog-sections';
import { CATALOG_TREE, findCatalogPath, flattenCatalogTree } from './catalog-tree';

describe('catalog tree', () => {
  it('gives every category a unique slug and a name in both languages', () => {
    const all = flattenCatalogTree();
    expect(new Set(all.map((node) => node.slug)).size).toBe(all.length);
    for (const node of all) {
      expect(node.slug).toMatch(/^[a-z0-9-]+$/);
      expect(node.name.uk.trim()).not.toBe('');
      expect(node.name.ru.trim()).not.toBe('');
      expect(node.productCount).toBeGreaterThan(0);
    }
  });

  it('finds the path from a section to a nested category', () => {
    const [section] = CATALOG_TREE.filter((node) => node.children.length > 0);
    const child = section.children[0];

    expect(findCatalogPath(child.slug)?.map((node) => node.slug)).toEqual([
      section.slug,
      child.slug,
    ]);
    expect(findCatalogPath('no-such-category')).toBeNull();
  });

  it('exposes the two upper levels as menu sections', () => {
    expect(CATALOG_SECTIONS.map((section) => section.slug)).toEqual(
      CATALOG_TREE.map((node) => node.slug),
    );
  });
});

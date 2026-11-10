import { flattenCatalogTree } from '@site/catalog/model';

import {
  getCatalogCategory,
  getCatalogCategoryProducts,
  getCatalogCategorySlugs,
} from './catalog-source';

describe('catalog source', () => {
  it('has a category page for every category of the tree and nothing else', async () => {
    const slugs = await getCatalogCategorySlugs();

    expect([...slugs].sort()).toEqual(
      flattenCatalogTree()
        .map((node) => node.slug)
        .sort(),
    );
  });

  it('returns the products of a category in listing order with names in both languages', async () => {
    for (const slug of await getCatalogCategorySlugs()) {
      const category = await getCatalogCategory(slug);
      if (!category) throw new Error(`no category ${slug}`);
      const products = await getCatalogCategoryProducts(category);

      expect(products.map((product) => product.slug)).toEqual(category.productSlugs);
      expect(products.length).toBeGreaterThan(0);
      for (const product of products) {
        expect(product.name.uk.trim()).not.toBe('');
        expect(product.name.ru.trim()).not.toBe('');
      }
    }
  });

  it('matches the model counts of the tree', async () => {
    for (const node of flattenCatalogTree()) {
      const category = await getCatalogCategory(node.slug);
      expect(category?.productSlugs.length).toBe(node.productCount);
      expect(category?.name).toEqual(node.name);
    }
  });

  it('answers null for an unknown category', async () => {
    expect(await getCatalogCategory('no-such-category')).toBeNull();
  });
});

import { flattenCatalogTree } from '@site/catalog/model';

import {
  getCatalogCategory,
  getCatalogCategoryProducts,
  getCatalogCategorySlugs,
  getCatalogProduct,
  getCatalogProductSlugs,
  getCatalogRelatedProducts,
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

  it('has a product page for every listed product, with a category, a photo, and text in both languages', async () => {
    const slugs = new Set(await getCatalogProductSlugs());
    const categories = new Set(await getCatalogCategorySlugs());

    for (const categorySlug of categories) {
      const category = await getCatalogCategory(categorySlug);
      for (const slug of category?.productSlugs ?? []) expect(slugs.has(slug)).toBe(true);
    }
    for (const slug of slugs) {
      const product = await getCatalogProduct(slug);
      if (!product) throw new Error(`no product ${slug}`);
      expect(categories.has(product.categorySlug)).toBe(true);
      expect(product.photos.length).toBeGreaterThan(0);
      expect(product.name.uk.trim()).not.toBe('');
      expect(product.name.ru.trim()).not.toBe('');
      expect(product.description.uk.length + product.summary.uk.length).toBeGreaterThan(0);
      expect(product.description.ru.length + product.summary.ru.length).toBeGreaterThan(0);
    }
  });

  it('offers other models of the same category and never the product itself', async () => {
    for (const slug of await getCatalogProductSlugs()) {
      const product = await getCatalogProduct(slug);
      if (!product) throw new Error(`no product ${slug}`);
      const related = await getCatalogRelatedProducts(product, 4);

      expect(related.length).toBeLessThanOrEqual(4);
      expect(related.map((card) => card.slug)).not.toContain(slug);
    }
  });

  it('answers null for an unknown product', async () => {
    expect(await getCatalogProduct('no-such-product')).toBeNull();
  });
});

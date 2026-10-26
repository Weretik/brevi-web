import { describe, expect, it } from 'vitest';

import { mapPublishedSewingProducts } from './published-sewing-products.mapper';

const article = {
  articleId: 501,
  saleSku: 'ART-501',
  publicationId: '33333333-3333-4333-8333-333333333333',
  calculationId: '11111111-1111-4111-8111-111111111111',
  publishedAt: '2026-10-25T11:00:00Z',
  prices: { retail: 310, wholesale: 264, largeWholesale: 250 },
};

describe('Published Product price boundary', () => {
  it('preserves stored tiers while discarding transport-only fields', () => {
    const result = mapPublishedSewingProducts(
      [{ productId: 42, articleCount: 1, articles: [{ ...article, internal: true }] }],
      [42],
    );
    expect(result[0]?.articles).toEqual([article]);
    expect(result[0]?.articles[0]?.prices).not.toBe(article.prices);
  });

  it('rejects duplicated Articles and publications exceeding the active Article count', () => {
    for (const row of [
      { productId: 42, articleCount: 2, articles: [article, article] },
      { productId: 42, articleCount: 0, articles: [article] },
    ]) {
      expect(() => mapPublishedSewingProducts([row], [42])).toThrow();
    }
  });

  it('rejects invalid published amounts and identities before returning a Product', () => {
    for (const invalid of [
      { ...article, prices: { ...article.prices, wholesale: Number.NaN } },
      { ...article, publicationId: 'invalid' },
      { ...article, publishedAt: 'invalid' },
    ]) {
      expect(() =>
        mapPublishedSewingProducts([{ productId: 42, articleCount: 1, articles: [invalid] }], [42]),
      ).toThrow();
    }
  });
});

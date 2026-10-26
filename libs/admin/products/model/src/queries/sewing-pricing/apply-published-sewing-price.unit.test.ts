import { describe, expect, it } from 'vitest';

import { applyPublishedSewingPrice } from './apply-published-sewing-price';

import type { PublishedSewingProduct } from '../../entities/sewing-pricing/published-sewing-product';
import type { Product } from '../../product-list/product';

const product: Product = {
  id: 42,
  name: 'Куртка',
  slug: 'jacket',
  type: 'Sewing',
  categoryIds: [],
  minimumWholesalePrice: 999,
  createdAtUtc: '',
  updatedAtUtc: null,
};
const published: PublishedSewingProduct = {
  productId: 42,
  articleCount: 2,
  articles: [
    {
      articleId: 501,
      saleSku: '246',
      publicationId: 'p',
      calculationId: 'c',
      publishedAt: '',
      prices: { retail: 310, wholesale: 264, largeWholesale: 250 },
    },
    {
      articleId: 502,
      saleSku: '247',
      publicationId: 'p2',
      calculationId: 'c2',
      publishedAt: '',
      prices: { retail: 300, wholesale: 260, largeWholesale: 240 },
    },
  ],
};

describe('published Product price selection', () => {
  it('selects wholesale from published Articles, without using large-wholesale or legacy prices', () => {
    expect(applyPublishedSewingPrice(product, [published], 'ready').minimumWholesalePrice).toBe(
      260,
    );
  });
  it('keeps missing, failed and loading prices explicit, preserving PPE behavior', () => {
    expect(applyPublishedSewingPrice(product, [], 'ready').sewingPriceStatus).toBe('unpublished');
    expect(applyPublishedSewingPrice(product, [published], 'error').minimumWholesalePrice).toBe(0);
    expect(applyPublishedSewingPrice(product, [published], 'loading').sewingPriceStatus).toBe(
      'loading',
    );
    const ppe = { ...product, type: 'Ppe' as const };
    expect(applyPublishedSewingPrice(ppe, [], 'ready')).toBe(ppe);
  });
});

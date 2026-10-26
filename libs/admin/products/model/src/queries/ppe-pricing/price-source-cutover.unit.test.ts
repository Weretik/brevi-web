import { describe, expect, it } from 'vitest';

import { applyPpePrice } from './apply-ppe-price';

import type { Product } from '../../product-list/product';

describe('TS-007 current price source', () => {
  it('does not reactivate an old amount when PPE is not enrolled', () => {
    const product: Product = {
      id: 42,
      type: 'Ppe',
      name: 'PPE',
      slug: 'ppe',
      categoryIds: [],
      minimumWholesalePrice: 999,
      createdAtUtc: '',
      updatedAtUtc: null,
    };
    const result = applyPpePrice(
      product,
      [
        {
          productId: 42,
          isEnrolled: false,
          offer: null,
          rule: null,
          prices: null,
          blockers: ['MissingOffer'],
        },
      ],
      'ready',
    );
    expect(result.minimumWholesalePrice).toBe(0);
    expect(result.ppePriceStatus).toBe('blocked');
  });
});

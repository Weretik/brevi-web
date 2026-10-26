import { describe, expect, it } from 'vitest';

import { applyPpePrice } from './apply-ppe-price';

import type { PpeProductPricing } from '../../entities/ppe-pricing/ppe-product-pricing';
import type { Product } from '../../product-list/product';

const product: Product = {
  id: 42,
  name: 'ЗІЗ',
  slug: 'ppe',
  type: 'Ppe',
  categoryIds: [],
  minimumWholesalePrice: 999,
  createdAtUtc: '',
  updatedAtUtc: null,
};
const current: PpeProductPricing = {
  productId: 42,
  isEnrolled: true,
  offer: null,
  rule: null,
  prices: { retail: 150, wholesale: 136, largeWholesale: 130 },
  blockers: [],
};
describe('PPE authoritative price projection', () => {
  it('selects current wholesale and never revives legacy prices for blocked or loading PPE', () => {
    expect(applyPpePrice(product, [current], 'ready').minimumWholesalePrice).toBe(136);
    expect(
      applyPpePrice(
        product,
        [{ ...current, prices: null, blockers: ['UnapprovedOffer'] }],
        'ready',
      ),
    ).toMatchObject({ minimumWholesalePrice: 0, ppePriceStatus: 'blocked' });
    expect(applyPpePrice(product, [], 'loading')).toMatchObject({
      minimumWholesalePrice: 0,
      ppePriceStatus: 'loading',
    });
    expect(applyPpePrice(product, [], 'error')).toMatchObject({
      minimumWholesalePrice: 0,
      ppePriceStatus: 'error',
    });
  });
  it('blocks non-enrolled PPE and leaves Sewing untouched', () => {
    expect(
      applyPpePrice(product, [{ ...current, isEnrolled: false, prices: null }], 'ready')
        .minimumWholesalePrice,
    ).toBe(0);
    const sewing = { ...product, type: 'Sewing' as const };
    expect(applyPpePrice(sewing, [], 'loading')).toBe(sewing);
    expect(applyPpePrice(product, [], 'ready').ppePriceStatus).toBe('blocked');
  });
});

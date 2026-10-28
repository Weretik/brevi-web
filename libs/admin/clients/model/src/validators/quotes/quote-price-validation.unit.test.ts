import { describe, expect, it } from 'vitest';

import { quotePriceErrors } from './quote-price-validation';

describe('quote manual pricing rules (SC-Q03/06)', () => {
  it('accepts catalog selections and requires an actual article for sewing', () => {
    expect(quotePriceErrors({ kind: 'ppe', productId: 42 })).toEqual({});
    expect(quotePriceErrors({ kind: 'sewing', productId: 25, articleId: 0 })).toHaveProperty(
      'articleId',
    );
  });

  it('requires a positive two-place PPE override with a reason', () => {
    expect(
      quotePriceErrors({
        kind: 'ppe',
        productId: 42,
        override: { tier: 'retail', amount: 1.001, reason: ' ' },
      }),
    ).toHaveProperty('amount');
    expect(
      quotePriceErrors({
        kind: 'ppe',
        productId: 42,
        override: { tier: 'retail', amount: 125.25, reason: 'Погоджено' },
      }),
    ).toEqual({});
  });

  it('keeps one-off PPE separate and checks all three manual tiers without calculating them', () => {
    const prices = {
      retail: 250,
      wholesale: 225,
      largeWholesale: 200,
      reason: 'Разове замовлення',
    };
    expect(quotePriceErrors({ kind: 'oneOffPpe', prices })).toEqual({});
    expect(
      quotePriceErrors({
        kind: 'oneOffPpe',
        prices: { ...prices, retail: NaN, wholesale: 0, largeWholesale: -1, reason: '' },
      }),
    ).toEqual(
      expect.objectContaining({
        retail: expect.any(String),
        wholesale: expect.any(String),
        largeWholesale: expect.any(String),
        reason: expect.any(String),
      }),
    );
  });
});

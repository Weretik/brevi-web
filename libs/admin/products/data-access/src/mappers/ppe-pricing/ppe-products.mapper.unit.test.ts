import { describe, expect, it } from 'vitest';

import { mapPpeProducts } from './ppe-products.mapper';
import { ppePricingFixture } from '../../test-fixtures/ppe-pricing/ppe-pricing.fixture';

describe('PPE response boundary', () => {
  it('maps exact server prices without exposing transport/approval actor fields', () => {
    const value = mapPpeProducts([ppePricingFixture], [42])[0]!;
    expect(value.prices?.wholesale).toBe(136);
    expect(value.offer).not.toHaveProperty('approvedBy');
    expect(value.prices).not.toBe(ppePricingFixture.calculation.prices);
  });
  it('rejects another Product, duplicate rows and inconsistent enrollment/readiness', () => {
    expect(() => mapPpeProducts([ppePricingFixture], [99])).toThrow();
    expect(() => mapPpeProducts([ppePricingFixture, ppePricingFixture], [42])).toThrow();
    expect(() => mapPpeProducts([{ ...ppePricingFixture, isEnrolled: false }], [42])).toThrow();
    expect(() =>
      mapPpeProducts(
        [
          {
            ...ppePricingFixture,
            calculation: { ...ppePricingFixture.calculation, isCalculated: false },
          },
        ],
        [42],
      ),
    ).toThrow();
  });
  it('rejects malformed tier amounts, approval dates and mismatched rule scope', () => {
    for (const row of [
      {
        ...ppePricingFixture,
        offer: { ...ppePricingFixture.offer, isApproved: false, approvedAt: null },
      },
      {
        ...ppePricingFixture,
        calculation: {
          ...ppePricingFixture.calculation,
          prices: { retail: 150, wholesale: NaN, largeWholesale: 130 },
        },
      },
      { ...ppePricingFixture, offer: { ...ppePricingFixture.offer, approvedAt: null } },
      {
        ...ppePricingFixture,
        rule: {
          ...ppePricingFixture.rule,
          values: { ...ppePricingFixture.rule.values, code: 'other' },
        },
      },
    ])
      expect(() => mapPpeProducts([row], [42])).toThrow();
  });
  it('maps source-reviewed draft blockers without prices or automatic approval', () => {
    const row = structuredClone(ppePricingFixture) as Record<string, unknown>;
    row['offer'] = {
      ...ppePricingFixture.offer,
      isApproved: false,
      approvedAt: null,
      approvedBy: null,
    };
    row['calculation'] = {
      prices: null,
      isCalculated: false,
      blockers: [{ code: 'UnapprovedOffer', inputKey: 'offer' }],
    };
    expect(mapPpeProducts([row], [42])[0]).toMatchObject({
      prices: null,
      blockers: ['UnapprovedOffer'],
      offer: { isApproved: false, values: { sourceReviewed: true } },
    });
  });
});

import type { PpeProductsDto } from '../../contracts/ppe-pricing/ppe-products.dto';

export const ppePricingFixture = {
  productId: 42,
  isEnrolled: true,
  offer: {
    id: '11111111-1111-4111-8111-111111111111',
    productId: 42,
    values: {
      ruleCode: 'Rule',
      supplierCost: 100,
      externalRetail: null,
      externalWholesale: null,
      source: 'test-source',
      sourceDate: '2026-10-25',
      sourceReviewed: true,
    },
    isApproved: true,
    approvedBy: 'reviewer',
    approvedAt: '2026-10-25T10:00:00Z',
    createdAt: '2026-10-25T10:00:00Z',
  },
  rule: {
    id: '22222222-2222-4222-8222-222222222222',
    values: {
      code: 'Rule',
      markups: { retail: 0.5, wholesale: 0.36, largeWholesale: 0.3 },
      source: 'test-source',
      sourceDate: '2026-10-25',
    },
    isApproved: true,
    approvedBy: 'reviewer',
    approvedAt: '2026-10-25T10:00:00Z',
    createdAt: '2026-10-25T10:00:00Z',
  },
  calculation: {
    prices: { retail: 150, wholesale: 136, largeWholesale: 130 },
    blockers: [],
    isCalculated: true,
  },
} satisfies PpeProductsDto[number];

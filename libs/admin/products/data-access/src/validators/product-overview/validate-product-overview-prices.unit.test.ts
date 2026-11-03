import { describe, expect, it } from 'vitest';

import { parseProductOverviewPrices } from './validate-product-overview-prices';

const tiers = { retail: 10, wholesale: 9, largeWholesale: 8 };

describe('product overview prices responses', () => {
  it('accepts the list prices', () => {
    const prices = [
      {
        productId: 1,
        status: 'Stale',
        from: tiers,
        pricesUpdatedAt: '2026-11-03T10:00:00Z',
        blockers: [],
        articles: [
          {
            articleId: 2,
            saleSku: '602',
            active: true,
            fabricId: null,
            published: tiers,
            publishedAt: '2026-11-03T10:00:00Z',
            live: tiers,
            isStale: false,
            blockers: [],
          },
        ],
      },
    ];
    expect(parseProductOverviewPrices(prices)).toBe(prices);
  });

  it('rejects an unknown status', () => {
    expect(() =>
      parseProductOverviewPrices([
        {
          productId: 1,
          status: 'Old',
          from: null,
          pricesUpdatedAt: null,
          blockers: [],
          articles: [],
        },
      ]),
    ).toThrow();
  });
});

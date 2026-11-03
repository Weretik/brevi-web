import { describe, expect, it } from 'vitest';

import {
  parseProductOverviewPrices,
  parseSewingRecalculationReport,
} from './validate-product-overview-prices';

const tiers = { retail: 10, wholesale: 9, largeWholesale: 8 };

describe('product overview prices responses', () => {
  it('accepts the list prices and the recalculation report', () => {
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
    const report = {
      applied: false,
      unchanged: 0,
      changes: [
        { productId: 1, modelCode: null, articleId: 2, saleSku: '602', before: null, after: tiers },
      ],
      blocked: [
        { productId: 1, modelCode: 'MOD-1', articleId: 3, saleSku: '603', blockers: ['X'] },
      ],
    };
    expect(parseSewingRecalculationReport(report)).toBe(report);
  });

  it('rejects an unknown status or a change without new prices', () => {
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
    expect(() =>
      parseSewingRecalculationReport({
        applied: true,
        unchanged: 0,
        changes: [
          { productId: 1, modelCode: null, articleId: 2, saleSku: '1', before: null, after: null },
        ],
        blocked: [],
      }),
    ).toThrow();
  });
});

import { describe, expect, it } from 'vitest';

import { buildProductListRows, productArticleLabel, productHasPrice } from './product-list-rows';

import type { ProductOverview } from '../../entities/product-overview/product-overview';
import type {
  ProductArticlePrices,
  ProductOverviewPrices,
} from '../../entities/product-overview/product-overview-prices';

const product = (id: number): ProductOverview => ({
  id,
  type: 'Sewing',
  code: `MOD-${id}`,
  name: `Модель ${id}`,
  sectionId: null,
  season: null,
  isActive: true,
  isVerified: false,
  verifiedOn: null,
  currentSiteUrl: null,
  quoteDescription: null,
  updatedAtUtc: '2026-11-03T10:00:00Z',
});

const article = (articleId: number, fabricId: number | null): ProductArticlePrices => ({
  articleId,
  saleSku: String(articleId),
  active: true,
  fabricId,
  published: null,
  publishedAt: null,
  live: null,
  isStale: false,
  blockers: [],
});

const prices = (productId: number, articles: ProductArticlePrices[]): ProductOverviewPrices => ({
  productId,
  status: 'Unpublished',
  from: null,
  pricesUpdatedAt: null,
  blockers: [],
  articles,
});

describe('product list rows', () => {
  it('puts the articles of an expanded model right after it, with negative ids', () => {
    const map = new Map([
      [1, prices(1, [article(602, 7), article(603, null)])],
      [2, prices(2, [article(700, null)])],
    ]);
    const rows = buildProductListRows(
      [product(1), product(2)],
      map,
      new Set([1]),
      new Map([[7, 'Грета']]),
    );
    expect(rows.map((row) => [row.kind, row.id, row.name])).toEqual([
      ['model', 1, 'Модель 1'],
      ['article', -602, 'Грета · арт. 602'],
      ['article', -603, 'Арт. 603'],
      ['model', 2, 'Модель 2'],
    ]);
    expect(rows[0]).toMatchObject({ expanded: true });
    expect(rows[3]).toMatchObject({ expanded: false });
  });

  it('does not expand a model without articles or prices', () => {
    const rows = buildProductListRows([product(1)], new Map(), new Set([1]), new Map());
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ kind: 'model', expanded: false, prices: null });
  });

  it('counts a row as priced only with a «від» price', () => {
    expect(productHasPrice(null)).toBe(false);
    expect(productHasPrice(prices(1, []))).toBe(false);
    expect(
      productHasPrice({ ...prices(1, []), from: { retail: 1, wholesale: 1, largeWholesale: 1 } }),
    ).toBe(true);
    expect(productArticleLabel(article(5, 9), new Map())).toBe('Арт. 5');
  });
});

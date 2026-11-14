import { describe, expect, it } from 'vitest';

import { buildProductListRows, productVariantLabel } from './product-list-rows';

import type {
  ProductOverview,
  ProductVariant,
} from '../../entities/product-overview/product-overview';

const variant = (articleId: number, fabricName: string | null): ProductVariant => ({
  articleId,
  saleSku: String(articleId),
  active: true,
  fabricId: fabricName ? 1 : null,
  fabricName,
  prices: { retail: 100, wholesale: 90, largeWholesale: 80 },
  publishedAt: null,
  problems: [],
});

const product = (id: number, variants: ProductVariant[]): ProductOverview => ({
  id,
  type: 'Sewing',
  code: `MOD-${id}`,
  name: `Модель ${id}`,
  sectionId: null,
  season: null,
  isActive: true,
  currentSiteUrl: null,
  quoteDescription: null,
  updatedAtUtc: '2026-11-03T10:00:00Z',
  mainPhotoUrl: null,
  mainPhotoFullUrl: null,
  prices: null,
  pricesUpdatedAt: null,
  problems: [],
  variants,
});

describe('buildProductListRows', () => {
  it('puts the fabric variants of an expanded model under it', () => {
    const rows = buildProductListRows(
      [product(1, [variant(11, 'Габардин'), variant(12, null)]), product(2, [variant(21, 'Бязь')])],
      new Set([1]),
    );
    expect(rows.map((row) => [row.kind, row.id, row.name])).toEqual([
      ['model', 1, 'Модель 1'],
      ['variant', -11, 'Габардин · арт. 11'],
      ['variant', -12, 'Арт. 12'],
      ['model', 2, 'Модель 2'],
    ]);
  });

  it('does not expand a model without variants', () => {
    expect(buildProductListRows([product(3, [])], new Set([3]))).toHaveLength(1);
  });

  it('names a variant by its fabric', () => {
    expect(productVariantLabel(variant(5, 'Саржа'))).toBe('Саржа · арт. 5');
  });
});

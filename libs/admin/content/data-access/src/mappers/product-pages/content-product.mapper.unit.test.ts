import { describe, expect, it } from 'vitest';

import {
  mapContentProduct,
  mapContentProductPage,
  mapContentProductVisibility,
} from './content-product.mapper';

const row = {
  productId: 1,
  type: 'Sewing',
  code: 'MOD-001',
  name: 'Костюм Лідер',
  sectionId: 10,
  sectionName: 'Костюми',
  isActive: true,
  mainPhotoUrl: null,
  hasPrice: true,
  hasPage: true,
  showOnSite: true,
  onSite: true,
  slug: 'kostyum-lider',
  hasUkrainianText: true,
  hasRussianText: false,
  hasSeo: false,
  updatedAtUtc: '2026-11-11T08:00:00+00:00',
  categoryCount: 2,
  categoryIds: [1, 2],
};
const emptyText = {
  name: null,
  seoTitle: null,
  seoDescription: null,
  summary: [],
  description: [],
  specs: [],
};

describe('content product mapper', () => {
  it('maps a page of rows', () => {
    const page = mapContentProductPage({ items: [row], page: 1, pageSize: 50, total: 1 });
    expect(page.total).toBe(1);
    expect(page.items[0]).toMatchObject({ productId: 1, type: 'Sewing', slug: 'kostyum-lider' });
  });

  it('maps the editor with texts, prices and fabrics', () => {
    const product = mapContentProduct({
      product: row,
      revision: 3,
      slug: 'kostyum-lider',
      updatedBy: 'admin@brevi.test',
      uk: {
        ...emptyText,
        name: 'Костюм «Лідер»',
        summary: [{ label: null, text: 'Для роботи надворі' }],
        description: [
          { kind: 'Paragraph', text: 'Зручний.', lead: 'Куртка:' },
          { kind: 'List', items: ['дві кишені'] },
        ],
        specs: [{ title: 'Куртка', rows: [{ name: 'Застібка', value: 'блискавка' }] }],
      },
      ru: emptyText,
      prices: { retail: 1500, wholesale: 1400, largeWholesale: 1300 },
      variants: [
        {
          articleId: 101,
          saleSku: 'MOD-001-A',
          isActive: true,
          fabricName: 'Грета',
          fabricDetails: null,
          prices: null,
        },
      ],
      categoryIds: [7, 9],
    });
    expect(product.revision).toBe(3);
    expect(product.uk.description).toEqual([
      { kind: 'Paragraph', text: 'Зручний.', lead: 'Куртка:', items: [] },
      { kind: 'List', text: null, lead: null, items: ['дві кишені'] },
    ]);
    expect(product.prices?.largeWholesale).toBe(1300);
    expect(product.variants[0]?.fabricName).toBe('Грета');
    expect(product.product.categoryCount).toBe(2);
    expect(product.product.categoryIds).toEqual([1, 2]);
    expect(product.categoryIds).toEqual([7, 9]);
  });

  it('maps the answer of the switch', () => {
    expect(
      mapContentProductVisibility({
        productId: 1,
        showOnSite: true,
        onSite: false,
        revision: 2,
        slug: 'abc',
      }),
    ).toEqual({ productId: 1, showOnSite: true, onSite: false, revision: 2, slug: 'abc' });
  });

  it('refuses an answer of another shape', () => {
    expect(() =>
      mapContentProductPage({
        items: [{ ...row, type: 'Other' }],
        page: 1,
        pageSize: 50,
        total: 1,
      }),
    ).toThrow('Некоректна відповідь API контенту сайту');
    expect(() => mapContentProduct({ product: row })).toThrow();
  });
});

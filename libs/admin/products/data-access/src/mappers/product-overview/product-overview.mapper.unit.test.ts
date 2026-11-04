import { describe, expect, it } from 'vitest';

import { mapProductOverviewPage, productOverviewSearchParams } from './product-overview.mapper';
import {
  parseProductOverviewItem,
  parseProductOverviewPage,
} from '../../validators/product-overview/validate-product-overview';

const variant = {
  articleId: 246,
  saleSku: '602',
  active: true,
  fabricId: 3,
  fabricName: 'Габардин',
  prices: { retail: 1200, wholesale: 1100, largeWholesale: 1000 },
  publishedAt: '2026-11-03T10:00:00Z',
  problems: [],
};

const row = {
  id: 7,
  type: 'Sewing',
  code: 'MOD-025',
  name: 'Костюм «Верде»',
  sectionId: 2,
  season: 'Літо',
  isActive: true,
  currentSiteUrl: 'https://brevi.com.ua/specodyag-litnij/kostyum-verde',
  quoteDescription: null,
  updatedAtUtc: '2026-11-03T10:00:00Z',
  prices: { retail: 1200, wholesale: 1100, largeWholesale: 1000 },
  pricesUpdatedAt: '2026-11-03T10:00:00Z',
  problems: [],
  variants: [variant],
};

const page = {
  items: [row],
  page: 1,
  pageSize: 25,
  total: 1,
  all: 124,
  sections: [{ sectionId: null, count: 3 }],
  withoutPrice: 0,
};

describe('product overview response', () => {
  it('maps a valid page', () => {
    expect(mapProductOverviewPage(parseProductOverviewPage(page))).toEqual(page);
  });

  it('rejects an unknown season or type and a broken variant', () => {
    expect(() => parseProductOverviewItem({ ...row, season: 'Summer' })).toThrow();
    expect(() => parseProductOverviewItem({ ...row, type: 'Other' })).toThrow();
    expect(() =>
      parseProductOverviewItem({ ...row, variants: [{ ...variant, prices: { retail: 1 } }] }),
    ).toThrow();
  });

  it('sends only the set filters', () => {
    expect(
      productOverviewSearchParams({
        type: 'Sewing',
        search: '  602 ',
        section: 'none',
        withoutPrice: true,
        sort: 'price',
        direction: 'desc',
        page: 2,
        pageSize: 25,
      }),
    ).toBe(
      'type=Sewing&search=602&section=none&withoutPrice=true&sort=price&direction=desc&page=2&pageSize=25',
    );
    expect(
      productOverviewSearchParams({
        type: 'Ppe',
        search: '',
        section: null,
        withoutPrice: false,
        sort: 'code',
        direction: 'asc',
        page: 1,
        pageSize: 10,
      }),
    ).toBe('type=Ppe&page=1&pageSize=10');
  });
});

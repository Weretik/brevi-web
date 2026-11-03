import { describe, expect, it } from 'vitest';

import { countProductsBySection, filterProductOverview } from './product-overview-filters';

import type { ProductOverview } from '../../entities/product-overview/product-overview';

const row = (
  id: number,
  sectionId: number | null,
  name: string,
  code: string | null = null,
): ProductOverview => ({
  id,
  type: 'Sewing',
  code,
  name,
  sectionId,
  season: null,
  isActive: true,
  isVerified: false,
  verifiedOn: null,
  currentSiteUrl: null,
  quoteDescription: null,
  updatedAtUtc: '2026-11-03T10:00:00Z',
});

const rows = [
  row(1, 2, 'Костюм «Верде»', 'MOD-025'),
  row(2, 1, 'Куртка'),
  row(3, null, 'Халат'),
  row(4, 9, 'Фартух'),
];

describe('product overview filters', () => {
  it('counts rows per section in section order, unknown sections, then rows without one', () => {
    expect(countProductsBySection(rows, [1, 2, 3])).toEqual([
      { sectionId: 1, count: 1 },
      { sectionId: 2, count: 1 },
      { sectionId: 9, count: 1 },
      { sectionId: null, count: 1 },
    ]);
  });

  it('filters by section chip and searches code and name', () => {
    expect(filterProductOverview(rows, '', 'none').map((x) => x.id)).toEqual([3]);
    expect(filterProductOverview(rows, 'mod-025', null).map((x) => x.id)).toEqual([1]);
    expect(filterProductOverview(rows, 'КУРТ', 1).map((x) => x.id)).toEqual([2]);
  });
});

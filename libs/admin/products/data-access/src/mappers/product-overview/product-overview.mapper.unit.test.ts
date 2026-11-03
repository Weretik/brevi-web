import { describe, expect, it } from 'vitest';

import { mapProductOverview } from './product-overview.mapper';
import { parseProductOverviewResponse } from '../../validators/product-overview/validate-product-overview';

const row = {
  id: 7,
  type: 'Sewing',
  code: 'MOD-025',
  name: 'Костюм «Верде»',
  sectionId: 2,
  season: 'Літо',
  isActive: true,
  isVerified: true,
  verifiedOn: '08.09.2026',
  currentSiteUrl: 'https://brevi.com.ua/specodyag-litnij/kostyum-verde',
  quoteDescription: null,
  updatedAtUtc: '2026-11-03T10:00:00Z',
};

describe('product overview response', () => {
  it('maps a valid row', () => {
    expect(mapProductOverview(parseProductOverviewResponse([row]))).toEqual([row]);
  });

  it('rejects an unknown season or type', () => {
    expect(() => parseProductOverviewResponse([{ ...row, season: 'Summer' }])).toThrow();
    expect(() => parseProductOverviewResponse([{ ...row, type: 'Other' }])).toThrow();
  });
});

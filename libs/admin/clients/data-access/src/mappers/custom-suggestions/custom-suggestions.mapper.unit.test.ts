import { describe, expect, it } from 'vitest';

import { mapCustomSuggestions } from './custom-suggestions.mapper';

const norm = {
  kind: 'accessory',
  referenceId: 3,
  unit: 'Piece',
  manualMinutes: null,
  sampleSize: 2,
  minimumQuantity: 1,
  maximumQuantity: 3,
  varyingNorm: true,
  quantity: 2,
};
const response = {
  productType: 'Куртка',
  season: 'summer',
  sampleSize: 3,
  sourceLimitReached: false,
  norms: [norm],
};
describe('suggestion runtime boundary', () => {
  it('maps price-free canonical norms and strips incidental supplier prices', () => {
    const result = mapCustomSuggestions({
      ...response,
      supplierPrice: 999,
      norms: [{ ...norm, price: 5 }],
    });
    expect(result).toEqual(response);
  });
  it.each([
    { ...response, productType: 'Unknown' },
    { ...response, sourceLimitReached: true },
    { ...response, sampleSize: 1 },
    ...[
      { quantity: NaN },
      { referenceId: -1 },
      { minimumQuantity: 3 },
      { maximumQuantity: 1 },
      { unit: '' },
      { manualMinutes: 0 },
      { kind: 'fabric' },
      { varyingNorm: 'yes' },
    ].map((change) => ({ ...response, norms: [{ ...norm, ...change }] })),
  ])('rejects invalid/unusable norms', (value) =>
    expect(() => mapCustomSuggestions(value)).toThrow(),
  );
  it('allows an empty limited response without partial norms', () => {
    expect(
      mapCustomSuggestions({ ...response, sourceLimitReached: true, norms: [] }).norms,
    ).toEqual([]);
  });
});

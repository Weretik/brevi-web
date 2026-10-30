import { describe, expect, it } from 'vitest';

import { applyCustomSuggestions } from './apply-custom-suggestions';
import { emptyCustomConfiguration } from '../custom-sewing/custom-draft';

import type { CustomSuggestions } from '../../entities/custom-suggestions/custom-suggestions';

const suggestions: CustomSuggestions = {
  productType: 'Куртка',
  season: 'summer',
  sampleSize: 3,
  sourceLimitReached: false,
  norms: [
    {
      kind: 'accessory',
      referenceId: 2,
      unit: 'Piece',
      manualMinutes: null,
      quantity: 4,
      minimumQuantity: 3,
      maximumQuantity: 5,
      sampleSize: 3,
      varyingNorm: true,
    },
    {
      kind: 'operation',
      referenceId: 8,
      unit: 'Operations',
      manualMinutes: 2,
      quantity: 1,
      minimumQuantity: 1,
      maximumQuantity: 1,
      sampleSize: 3,
      varyingNorm: false,
    },
  ],
};
const configuration = {
  ...emptyCustomConfiguration(),
  productType: 'Куртка',
  internalNote: 'private',
  delivery: 20,
  fabrics: [{ referenceId: 1, quantity: 2, unit: 'Metre' }],
};
describe('explicit suggestion selection', () => {
  it('builds a separate configuration with suggested norms and preserves other input', () => {
    const result = applyCustomSuggestions(configuration, suggestions);
    expect(result.accessories).toEqual([{ referenceId: 2, quantity: 4, unit: 'Piece' }]);
    expect(result.operations).toEqual([{ referenceId: 8, quantity: 1, manualMinutes: 2 }]);
    expect(result.internalNote).toBe('private');
    expect(result.delivery).toBe(20);
    expect(result.fabrics).toEqual(configuration.fabrics);
    expect(configuration.accessories).toEqual([]);
  });
  it('clears root-owned artwork and sale approval in the new configuration', () => {
    const application = {
      kind: 'embroidery' as const,
      location: 'Груди',
      artworkFileId: '11111111-1111-4111-8111-111111111111',
      cost: 20,
      saleAmount: 30,
      saleApproved: true,
    };
    const result = applyCustomSuggestions(
      { ...configuration, applications: [application] },
      suggestions,
    );
    expect(result.applications).toEqual([
      { ...application, artworkFileId: null, saleApproved: false },
    ]);
    expect(application.artworkFileId).not.toBeNull();
    expect(application.saleApproved).toBe(true);
  });
  it.each([
    { ...suggestions, season: 'winter' as const },
    { ...suggestions, productType: 'Штани' as const },
    { ...suggestions, sourceLimitReached: true },
    { ...suggestions, sampleSize: 1 },
    { ...suggestions, norms: [] },
  ])('rejects stale or incomplete suggestion review', (value) => {
    expect(() => applyCustomSuggestions(configuration, value)).toThrow();
  });
});

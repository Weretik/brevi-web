import { describe, expect, it } from 'vitest';

import { compareQuoteBasis } from './compare-quote-basis';

import type { QuotePriceBasis } from '../../entities/quotes/quote-price-basis';

const basis = (): QuotePriceBasis => ({
  token: 'saved-token',
  expiresAt: 1,
  selection: { kind: 'ppe', productId: 42 },
  retail: 100,
  wholesale: null,
  largeWholesale: 80,
  blockers: [],
  currency: 'UAH',
  taxBasis: 'catalog_no_extra_vat',
  source: {
    sourceId: 'source-a',
    calculationId: null,
    ruleVersionId: null,
    compositionVersion: null,
    settingsVersionId: null,
    referenceVersionIds: [2, 1],
    formulaVersion: 'v1',
  },
});

describe('explicit quote basis comparison (SC-Q02)', () => {
  it('compares all tiers preserving null and original values without calculating prices', () => {
    const previous = basis();
    const next = { ...previous, retail: 120, wholesale: 90 };
    expect(compareQuoteBasis(previous, next).prices).toEqual([
      { tier: 'retail', before: 100, after: 120, changed: true },
      { tier: 'wholesale', before: null, after: 90, changed: true },
      { tier: 'largeWholesale', before: 80, after: 80, changed: false },
    ]);
    expect(previous.wholesale).toBeNull();
    expect(previous.retail).toBe(100);
  });
  it('detects changed source versions even when all three amounts match', () => {
    const previous = basis();
    const next = { ...previous, source: { ...previous.source!, sourceId: 'source-b' } };
    expect(compareQuoteBasis(previous, next).sourceChanged).toBe(true);
    expect(compareQuoteBasis(previous, next).prices.every((tier) => !tier.changed)).toBe(true);
  });
  it('ignores reference order without mutating it and distinguishes unavailable provenance', () => {
    const previous = basis();
    expect(
      compareQuoteBasis(previous, {
        ...previous,
        source: { ...previous.source!, referenceVersionIds: [1, 2] },
      }).sourceChanged,
    ).toBe(false);
    expect(previous.source!.referenceVersionIds).toEqual([2, 1]);
    expect(
      compareQuoteBasis({ ...previous, source: undefined }, previous).sourceChanged,
    ).toBeNull();
  });
  it('flags a blocked or mismatched result so it cannot be presented as confirmable', () => {
    const previous = basis();
    expect(
      compareQuoteBasis(previous, { ...previous, blockers: ['Unavailable'], retail: null }).blocked,
    ).toBe(true);
    expect(
      compareQuoteBasis(previous, { ...previous, selection: { kind: 'ppe', productId: 43 } })
        .selectionMatches,
    ).toBe(false);
  });
});

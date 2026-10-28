import { describe, expect, it } from 'vitest';

import { changeQuoteSelection } from './change-quote-selection';
import { sameQuoteSelection } from './same-quote-selection';

import type { QuoteVariantDraft } from '../../models/quotes/quote-variant-draft';

const variant: QuoteVariantDraft = {
  key: 'variant',
  publicId: 'saved-variant',
  title: 'Артикул',
  visible: true,
  selection: { kind: 'sewing', productId: 25, articleId: 246 },
  tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
  basis: {
    origin: 'saved',
    value: {
      token: 'historical-token',
      expiresAt: 0,
      selection: { kind: 'sewing', productId: 25, articleId: 246 },
      retail: 1169.74,
      wholesale: 996.17,
      largeWholesale: 943.34,
      blockers: [],
      currency: 'UAH',
      taxBasis: 'catalog_no_extra_vat',
    },
  },
};

describe('quote price selection (SC-Q02/03)', () => {
  it('discards the basis when a price input changes without mutating the saved variant', () => {
    const changed = changeQuoteSelection(variant, {
      kind: 'sewing',
      productId: 25,
      articleId: 247,
    });
    expect(changed.basis).toBeNull();
    expect(variant.basis?.value.retail).toBe(1169.74);
  });

  it('retains saved prices for the same selection even after the preview lifetime', () => {
    expect(changeQuoteSelection(variant, { ...variant.selection }).basis).toBe(variant.basis);
  });

  it('compares typed price inputs independently of property order and includes override reason', () => {
    expect(
      sameQuoteSelection(
        { kind: 'ppe', productId: 42, override: { tier: 'retail', amount: 100, reason: 'Один' } },
        { productId: 42, kind: 'ppe', override: { reason: 'Два', amount: 100, tier: 'retail' } },
      ),
    ).toBe(false);
    expect(
      sameQuoteSelection(
        { kind: 'sewing', productId: 25, articleId: 246 },
        { articleId: 246, productId: 25, kind: 'sewing' },
      ),
    ).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';

import { quoteBasisState } from './quote-basis-state';

import type { QuoteVariantDraft } from '../../models/quotes/quote-variant-draft';

function variant(origin: 'saved' | 'preview' = 'preview'): QuoteVariantDraft {
  return {
    key: 'v',
    publicId: 'saved-variant',
    title: 'Артикул',
    visible: true,
    selection: { kind: 'sewing', productId: 25, articleId: 246 },
    tierVisibility: { retail: true, wholesale: false, largeWholesale: true },
    basis: {
      origin,
      value: {
        token: 'token',
        expiresAt: 100,
        selection: { kind: 'sewing', productId: 25, articleId: 246 },
        retail: 100,
        wholesale: null,
        largeWholesale: null,
        blockers: ['MissingPublication'],
        currency: 'UAH',
        taxBasis: 'catalog_no_extra_vat',
      },
    },
  };
}

describe('quote basis lifetime and blockers (SC-Q01/02/07)', () => {
  it('requires a fresh preview for an unsaved variant even when it carries a copied saved basis', () => {
    expect(quoteBasisState({ ...variant('saved'), publicId: undefined }, 100)).toBe('missing');
  });

  it('rejects a basis without a usable token', () => {
    const original = variant();
    const invalid = {
      ...original,
      basis: { ...original.basis!, value: { ...original.basis!.value, token: '' } },
    };
    expect(quoteBasisState(invalid, 50)).toBe('missing');
  });

  it('expires fresh previews at the exact expiry instant without changing saved history', () => {
    expect(quoteBasisState(variant(), 100)).toBe('expired');
    expect(quoteBasisState(variant('saved'), 100)).toBe('blocked');
  });

  it('detects mismatched inputs even if a stale preview reaches the form', () => {
    expect(quoteBasisState({ ...variant(), selection: { kind: 'ppe', productId: 42 } }, 50)).toBe(
      'changed',
    );
  });
});

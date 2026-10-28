import { describe, expect, it } from 'vitest';

import { quoteDraftErrors } from './quote-draft-validation';

import type { QuoteDraft } from '../../models/quotes/quote-draft';

function draft(token = 'token', origin: 'preview' | 'saved' = 'preview'): QuoteDraft {
  const selection = { kind: 'sewing' as const, productId: 25, articleId: 246 };
  return {
    customerId: null,
    contactId: null,
    recipientName: 'Одержувач',
    items: [
      {
        key: 'i',
        title: 'Позиція',
        included: true,
        publicDescription: '',
        publicComment: '',
        internalNote: '',
        variants: [
          {
            key: 'v',
            title: 'Артикул',
            visible: true,
            selection,
            tierVisibility: { retail: true, wholesale: false, largeWholesale: true },
            basis: {
              origin,
              value: {
                token,
                expiresAt: 100,
                selection,
                retail: 100,
                wholesale: null,
                largeWholesale: null,
                blockers: ['MissingPublication'],
                currency: 'UAH',
                taxBasis: 'catalog_no_extra_vat',
              },
            },
          },
        ],
      },
    ],
  };
}

describe('quote draft save validation (SC-Q01/02/07)', () => {
  it('allows null prices with source blockers but rejects an expired fresh preview', () => {
    const original = draft();
    expect(quoteDraftErrors(original, 50)).toEqual({});
    expect(quoteDraftErrors(original, 100)).toHaveProperty('items.0.variants.0.basis');
    expect(original.items[0].variants[0].basis?.value.wholesale).toBeNull();
  });

  it('does not permit save with an empty token or a saved basis copied into a new variant', () => {
    expect(quoteDraftErrors(draft(''), 50)).toHaveProperty('items.0.variants.0.basis');
    expect(quoteDraftErrors(draft('copied-token', 'saved'), 100)).toHaveProperty(
      'items.0.variants.0.basis',
    );
  });
});

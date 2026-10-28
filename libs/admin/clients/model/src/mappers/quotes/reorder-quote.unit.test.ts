import { describe, expect, it } from 'vitest';

import { moveQuoteItem, moveQuoteVariant } from './reorder-quote';

import type { QuoteDraft } from '../../models/quotes/quote-draft';
import type { QuoteVariantDraft } from '../../models/quotes/quote-variant-draft';

describe('quote item order (SC-Q01)', () => {
  it('moves logical items without changing saved IDs or editing the original array', () => {
    const draft: QuoteDraft = {
      customerId: null,
      contactId: null,
      recipientName: 'Одержувач',
      items: ['first', 'second'].map((key) => ({
        key,
        publicId: key,
        title: key,
        included: true,
        publicDescription: '',
        publicComment: '',
        internalNote: '',
        variants: [],
      })),
    };
    const moved = moveQuoteItem(draft, 'second', -1);
    expect(moved.items.map((item) => item.publicId)).toEqual(['second', 'first']);
    expect(draft.items.map((item) => item.publicId)).toEqual(['first', 'second']);
    expect(moveQuoteItem(draft, 'first', -1).items).toBe(draft.items);
  });

  it('reorders alternatives only in the chosen item and retains each variant object', () => {
    const first: QuoteVariantDraft = {
      key: 'first',
      publicId: 'saved-first',
      title: 'Перший',
      visible: true,
      selection: { kind: 'ppe', productId: 42 },
      basis: null,
      tierVisibility: { retail: true, wholesale: true, largeWholesale: true },
    };
    const second = { ...first, key: 'second', publicId: 'saved-second' };
    const draft: QuoteDraft = {
      customerId: null,
      contactId: null,
      recipientName: 'Одержувач',
      items: ['chosen', 'other'].map((key) => ({
        key,
        title: key,
        included: true,
        publicDescription: '',
        publicComment: '',
        internalNote: '',
        variants: [first, second],
      })),
    };
    const moved = moveQuoteVariant(draft, 'chosen', 'second', -1);
    expect(moved.items[0].variants[0]).toBe(second);
    expect(moved.items[0].variants[1]).toBe(first);
    expect(moved.items[1]).toBe(draft.items[1]);
    expect(draft.items[0].variants[0]).toBe(first);
    expect(moveQuoteVariant(draft, 'chosen', 'unknown', -1)).toEqual(draft);
  });
});

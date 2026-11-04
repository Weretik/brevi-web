import { catalogItemDraft, emptyQuoteDraft } from '@admin/quotes/model';
import { describe, expect, it } from 'vitest';

import { toSaveQuoteInput } from './quote-input.mapper';

import type { QuoteCatalogProduct, QuoteItemDraft } from '@admin/quotes/model';

const product = (kind: 'Sewing' | 'Ppe'): QuoteCatalogProduct => ({
  productId: 3,
  kind,
  code: null,
  name: 'Імпульс',
  season: null,
  photoUrl: null,
  description: null,
  prices: { retail: 100, wholesale: 90, large: 80 },
  problem: null,
  variants: [],
});

const typed = (item: QuoteItemDraft, manual: string): QuoteItemDraft => ({
  ...item,
  options: item.options.map((option) => ({
    ...option,
    prices: { ...option.prices, retail: { ...option.prices.retail, manual } },
  })),
});

const save = (item: QuoteItemDraft) =>
  toSaveQuoteInput({ ...emptyQuoteDraft(), internalName: ' Агро ', items: [item] });

describe('toSaveQuoteInput', () => {
  it('sends a manual PPE price only when it differs from the Catalog one', () => {
    expect(save(typed(catalogItemDraft(product('Ppe')), '95')).items[0].options[0].retail).toEqual({
      shown: true,
      manual: 95,
    });
    expect(
      save(typed(catalogItemDraft(product('Ppe')), '100')).items[0].options[0].retail.manual,
    ).toBeNull();
  });

  it('never sends a manual price for a sewing model and trims the texts', () => {
    const sewing = catalogItemDraft(product('Sewing'), [
      {
        articleId: 5,
        sku: 'A-5',
        title: 'Саржа',
        fabricInfo: null,
        prices: { retail: 300, wholesale: 280, large: 250 },
        problem: null,
      },
    ]);
    const input = save(typed(sewing, '1'));
    expect(input.internalName).toBe('Агро');
    expect(input.recipientName).toBeNull();
    expect(input.items[0].options[0]).toMatchObject({ articleId: 5, retail: { manual: null } });
  });
});

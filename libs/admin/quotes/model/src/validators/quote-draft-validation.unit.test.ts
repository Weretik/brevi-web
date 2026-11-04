import { describe, expect, it } from 'vitest';

import { quoteDraftErrors } from './quote-draft-validation';
import { catalogItemDraft, emptyQuoteDraft, oneOffItemDraft } from '../mappers/quote-draft-mapper';

import type { QuoteCatalogProduct } from '../entities/quote-catalog';
import type { QuoteDraft, QuoteItemDraft } from '../models/quote-draft';

const ppe: QuoteCatalogProduct = {
  productId: 7,
  kind: 'Ppe',
  code: 'Z-1',
  name: 'Рукавиці',
  season: null,
  photoUrl: null,
  description: null,
  prices: { retail: 100, wholesale: 90, large: 80 },
  problem: null,
  variants: [],
};

const draftWith = (...items: QuoteItemDraft[]): QuoteDraft => ({
  ...emptyQuoteDraft(),
  internalName: 'Агро база',
  items,
});

const withPrice = (item: QuoteItemDraft, manual: string, reason = ''): QuoteItemDraft => {
  const option = item.options[0];
  return {
    ...item,
    options: [
      {
        ...option,
        manualReason: reason,
        prices: { ...option.prices, retail: { ...option.prices.retail, manual } },
      },
    ],
  };
};

describe('quoteDraftErrors', () => {
  it('needs the client or request name', () => {
    expect(quoteDraftErrors(emptyQuoteDraft())).toEqual({
      header: 'Вкажіть клієнта або назву запиту.',
    });
  });

  it('accepts a catalog PPE with its prices', () => {
    expect(quoteDraftErrors(draftWith(catalogItemDraft(ppe)))).toEqual({});
  });

  it('asks a reason for a manual PPE price and accepts it with one', () => {
    const item = catalogItemDraft(ppe);
    const optionKey = item.options[0].key;
    expect(quoteDraftErrors(draftWith(withPrice(item, '95')))).toEqual({
      [`option:${optionKey}`]: 'Вкажіть причину ручної ціни.',
    });
    expect(quoteDraftErrors(draftWith(withPrice(item, '95', 'Знижка')))).toEqual({});
    expect(quoteDraftErrors(draftWith(withPrice(item, '100')))).toEqual({});
  });

  it('rejects a price that is not a number', () => {
    const item = withPrice(catalogItemDraft(ppe), '12,345', 'Знижка');
    expect(quoteDraftErrors(draftWith(item))[`option:${item.options[0].key}`]).toMatch(/^Ціна:/);
  });

  it('needs a name and a shown positive price for a one-off PPE', () => {
    const item = oneOffItemDraft();
    expect(quoteDraftErrors(draftWith(item))[`item:${item.key}`]).toBe(
      'Вкажіть назву разової позиції.',
    );
    const named = withPrice({ ...item, name: 'Каска' }, '250');
    expect(quoteDraftErrors(draftWith(named))).toEqual({});
  });

  it('needs at least one shown price above zero', () => {
    const item = catalogItemDraft(ppe);
    const hidden: QuoteItemDraft = {
      ...item,
      options: item.options.map((option) => ({
        ...option,
        prices: {
          retail: { ...option.prices.retail, shown: false },
          wholesale: { ...option.prices.wholesale, shown: false },
          large: { ...option.prices.large, shown: false },
        },
      })),
    };
    expect(quoteDraftErrors(draftWith(hidden))[`item:${item.key}`]).toBe(
      'Покажіть клієнту хоча б одну ціну більше нуля.',
    );
  });
});

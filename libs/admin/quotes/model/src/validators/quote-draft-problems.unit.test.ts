import { describe, expect, it } from 'vitest';

import { quoteDraftProblems, quoteDraftSummary, quoteTierVisibility } from './quote-draft-problems';
import { setQuoteTier, setQuoteTierShown } from '../mappers/editor/quote-draft-edits';
import {
  catalogItemDraft,
  emptyQuoteDraft,
  oneOffItemDraft,
} from '../mappers/editor/quote-draft-mapper';

import type { QuoteCatalogProduct } from '../entities/quote-catalog';
import type { QuoteDraft, QuoteItemDraft } from '../forms/editor/quote-draft';

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

describe('КП-level price tiers', () => {
  it('hides a tier in every row and reports a mixed state', () => {
    const a = catalogItemDraft(ppe);
    const b = catalogItemDraft(ppe);
    const draft = draftWith(a, b);
    expect(quoteTierVisibility(draft, 'large')).toBe('all');

    const hidden = setQuoteTierShown(draft, 'large', false);
    expect(quoteTierVisibility(hidden, 'large')).toBe('none');
    expect(quoteTierVisibility(hidden, 'retail')).toBe('all');

    const mixed = setQuoteTier(hidden, a.key, a.options[0].key, 'large', { shown: true });
    expect(quoteTierVisibility(mixed, 'large')).toBe('some');
  });

  it('counts the prices the client will see', () => {
    const draft = setQuoteTierShown(draftWith(catalogItemDraft(ppe)), 'large', false);
    expect(quoteDraftSummary(draft)).toEqual({ items: 1, options: 1, shownPrices: 2 });
  });
});

describe('quoteDraftProblems', () => {
  it('asks for the client and at least one item', () => {
    expect(quoteDraftProblems(emptyQuoteDraft())).toEqual([
      { target: 'header', text: 'Вкажіть клієнта або назву запиту.' },
      { target: 'items', text: 'Додайте хоча б одну позицію.' },
    ]);
  });

  it('names the item of each problem and is empty for a ready КП', () => {
    const item = oneOffItemDraft();
    expect(quoteDraftProblems(draftWith(catalogItemDraft(ppe), item))).toEqual([
      { target: item.key, text: '02 Без назви: Вкажіть назву разової позиції.' },
    ]);
    expect(quoteDraftProblems(draftWith(catalogItemDraft(ppe)))).toEqual([]);
  });
});

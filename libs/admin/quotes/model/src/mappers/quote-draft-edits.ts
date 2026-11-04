import type { QuoteTier } from '../entities/quote';
import type { QuoteDraft, QuoteItemDraft, QuoteOptionDraft } from '../models/quote-draft';

const mapItem = (
  draft: QuoteDraft,
  key: string,
  change: (item: QuoteItemDraft) => QuoteItemDraft,
): QuoteDraft => ({
  ...draft,
  items: draft.items.map((item) => (item.key === key ? change(item) : item)),
});

export function updateQuoteItem(
  draft: QuoteDraft,
  key: string,
  patch: Partial<QuoteItemDraft>,
): QuoteDraft {
  return mapItem(draft, key, (item) => ({ ...item, ...patch }));
}

export function removeQuoteItem(draft: QuoteDraft, key: string): QuoteDraft {
  return { ...draft, items: draft.items.filter((item) => item.key !== key) };
}

export function moveQuoteItem(draft: QuoteDraft, key: string, offset: -1 | 1): QuoteDraft {
  const index = draft.items.findIndex((item) => item.key === key);
  const target = index + offset;
  if (index < 0 || target < 0 || target >= draft.items.length) return draft;
  const items = [...draft.items];
  [items[index], items[target]] = [items[target], items[index]];
  return { ...draft, items };
}

export function updateQuoteOption(
  draft: QuoteDraft,
  itemKey: string,
  optionKey: string,
  change: (option: QuoteOptionDraft) => QuoteOptionDraft,
): QuoteDraft {
  return mapItem(draft, itemKey, (item) => ({
    ...item,
    options: item.options.map((option) => (option.key === optionKey ? change(option) : option)),
  }));
}

export function setQuoteTier(
  draft: QuoteDraft,
  itemKey: string,
  optionKey: string,
  tier: QuoteTier,
  patch: { shown?: boolean; manual?: string },
): QuoteDraft {
  return updateQuoteOption(draft, itemKey, optionKey, (option) => ({
    ...option,
    prices: { ...option.prices, [tier]: { ...option.prices[tier], ...patch } },
  }));
}

/** One recommended fabric per model; choosing it again clears the mark. */
export function recommendQuoteOption(
  draft: QuoteDraft,
  itemKey: string,
  optionKey: string,
): QuoteDraft {
  return mapItem(draft, itemKey, (item) => ({
    ...item,
    options: item.options.map((option) => ({
      ...option,
      isRecommended: option.key === optionKey ? !option.isRecommended : false,
    })),
  }));
}

export function addQuoteOptions(
  draft: QuoteDraft,
  itemKey: string,
  options: readonly QuoteOptionDraft[],
): QuoteDraft {
  return mapItem(draft, itemKey, (item) => ({ ...item, options: [...item.options, ...options] }));
}

export function removeQuoteOption(
  draft: QuoteDraft,
  itemKey: string,
  optionKey: string,
): QuoteDraft {
  return mapItem(draft, itemKey, (item) => ({
    ...item,
    options: item.options.filter((option) => option.key !== optionKey),
  }));
}

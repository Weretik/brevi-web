import {
  addQuoteOptions,
  moveQuoteItem,
  recommendQuoteOption,
  removeQuoteItem,
  removeQuoteOption,
  setQuoteTier,
  updateQuoteItem,
  updateQuoteOption,
} from '@admin/quotes/model';
import { useCallback, useState } from 'react';

import type { QuoteDraft, QuoteItemDraft, QuoteOptionDraft, QuoteTier } from '@admin/quotes/model';

/** Editor content and its pure edits; the baseline tells whether something is unsaved. */
export function useQuoteDraft(initial: QuoteDraft) {
  const [draft, setDraft] = useState(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));

  const reset = useCallback((next: QuoteDraft) => {
    setDraft(next);
    setBaseline(JSON.stringify(next));
  }, []);

  return {
    draft,
    dirty: JSON.stringify(draft) !== baseline,
    reset,
    change: (patch: Partial<QuoteDraft>) => setDraft((current) => ({ ...current, ...patch })),
    addItems: (items: readonly QuoteItemDraft[]) =>
      setDraft((current) => ({ ...current, items: [...current.items, ...items] })),
    updateItem: (key: string, patch: Partial<QuoteItemDraft>) =>
      setDraft((current) => updateQuoteItem(current, key, patch)),
    removeItem: (key: string) => setDraft((current) => removeQuoteItem(current, key)),
    moveItem: (key: string, offset: -1 | 1) =>
      setDraft((current) => moveQuoteItem(current, key, offset)),
    setTier: (
      itemKey: string,
      optionKey: string,
      tier: QuoteTier,
      patch: { shown?: boolean; manual?: string },
    ) => setDraft((current) => setQuoteTier(current, itemKey, optionKey, tier, patch)),
    updateOption: (
      itemKey: string,
      optionKey: string,
      change: (option: QuoteOptionDraft) => QuoteOptionDraft,
    ) => setDraft((current) => updateQuoteOption(current, itemKey, optionKey, change)),
    recommend: (itemKey: string, optionKey: string) =>
      setDraft((current) => recommendQuoteOption(current, itemKey, optionKey)),
    addOptions: (itemKey: string, options: readonly QuoteOptionDraft[]) =>
      setDraft((current) => addQuoteOptions(current, itemKey, options)),
    removeOption: (itemKey: string, optionKey: string) =>
      setDraft((current) => removeQuoteOption(current, itemKey, optionKey)),
  };
}

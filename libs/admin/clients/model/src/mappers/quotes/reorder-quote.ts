import type { QuoteDraft } from '../../models/quotes/quote-draft';

function move<T extends { readonly key: string }>(
  rows: readonly T[],
  key: string,
  step: -1 | 1,
): readonly T[] {
  const from = rows.findIndex((row) => row.key === key);
  const to = from + step;
  if (from < 0 || to < 0 || to >= rows.length) return rows;
  const moved = [...rows];
  [moved[from], moved[to]] = [moved[to], moved[from]];
  return moved;
}

export function moveQuoteItem(draft: QuoteDraft, key: string, step: -1 | 1): QuoteDraft {
  return { ...draft, items: move(draft.items, key, step) };
}

export function moveQuoteVariant(
  draft: QuoteDraft,
  itemKey: string,
  variantKey: string,
  step: -1 | 1,
): QuoteDraft {
  return {
    ...draft,
    items: draft.items.map((item) =>
      item.key === itemKey ? { ...item, variants: move(item.variants, variantKey, step) } : item,
    ),
  };
}

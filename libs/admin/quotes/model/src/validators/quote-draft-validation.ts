import { parseQuotePrice } from '../mappers/quote-price-text';
import { quoteTiers } from '../models/quote-draft';

import type {
  QuoteDraft,
  QuoteItemDraft,
  QuoteOptionDraft,
  QuotePriceDraft,
} from '../models/quote-draft';

export const quoteNameMaxLength = 200;
export const quoteTextMaxLength = 4000;
export const quoteMaxPrice = 10_000_000;

/** Problems of the editor content by place: `header`, `item:<key>`, `option:<key>`. Empty when it can be saved. */
export type QuoteDraftErrors = Readonly<Record<string, string>>;

/** The amount the client will see for a price box, or null when it has none. */
export function draftPriceAmount(price: QuotePriceDraft): number | null {
  return price.manual.trim() ? parseQuotePrice(price.manual) : price.source;
}

/** A manual price that differs from the Catalog one. */
export function hasManualPrice(option: QuoteOptionDraft): boolean {
  return quoteTiers.some((tier) => {
    const price = option.prices[tier];
    if (!price.manual.trim()) return false;
    return parseQuotePrice(price.manual) !== price.source;
  });
}

function optionError(item: QuoteItemDraft, option: QuoteOptionDraft): string | null {
  for (const tier of quoteTiers) {
    const text = option.prices[tier].manual.trim();
    if (!text) continue;
    const value = parseQuotePrice(text);
    if (value === null || value > quoteMaxPrice)
      return 'Ціна: число до 10 000 000 з двома знаками після коми.';
  }
  if (item.kind === 'Ppe' && hasManualPrice(option) && !option.manualReason.trim())
    return 'Вкажіть причину ручної ціни.';
  return null;
}

function itemError(item: QuoteItemDraft): string | null {
  if (item.kind === 'OneOffPpe' && !item.name.trim()) return 'Вкажіть назву разової позиції.';
  if (item.kind === 'CustomSewing' && !item.name.trim()) return 'Вкажіть назву виробу з нуля.';
  if (item.options.length === 0) return 'Додайте хоча б один варіант тканини.';
  if (item.description.length > quoteTextMaxLength) return 'Опис задовгий.';
  const shows = item.options.some((option) =>
    quoteTiers.some(
      (tier) => option.prices[tier].shown && (draftPriceAmount(option.prices[tier]) ?? 0) > 0,
    ),
  );
  return shows ? null : 'Покажіть клієнту хоча б одну ціну більше нуля.';
}

export function quoteDraftErrors(draft: QuoteDraft): QuoteDraftErrors {
  const errors: Record<string, string> = {};
  if (!draft.internalName.trim()) errors['header'] = 'Вкажіть клієнта або назву запиту.';
  else if (draft.internalName.length > quoteNameMaxLength) errors['header'] = 'Назва задовга.';
  for (const item of draft.items) {
    const error = itemError(item);
    if (error) errors[`item:${item.key}`] = error;
    for (const option of item.options) {
      const problem = optionError(item, option);
      if (problem) errors[`option:${option.key}`] = problem;
    }
  }
  return errors;
}

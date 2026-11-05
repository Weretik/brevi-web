import type { Quote } from '../entities/quote';

/** A problem the manager should see before sending: only problems, never «all good» (admin rule). */
export interface QuotePreviewWarning {
  readonly key: string;
  readonly title: string;
  readonly text: string;
}

const position = (index: number) => String(index + 1).padStart(2, '0');

/**
 * What the PDF of a saved КП will miss: an item without a shown price is left out of it, an item without a photo
 * has only its description. Numbers follow the items of the editor.
 */
export function quotePreviewWarnings(quote: Quote): QuotePreviewWarning[] {
  const warnings: QuotePreviewWarning[] = [];
  quote.items.forEach((item, index) => {
    const priced = item.options.some((option) =>
      Object.values(option.prices).some((price) => price.shown && (price.amount ?? 0) > 0),
    );
    if (!priced)
      warnings.push({
        key: `price:${item.id}`,
        title: `Позиція ${position(index)} не потрапить у PDF`,
        text: `«${item.name}»: немає жодної показаної ціни.`,
      });
    else if (!item.photoUrl?.trim())
      warnings.push({
        key: `photo:${item.id}`,
        title: `Позиція ${position(index)} без фото`,
        text: `«${item.name}»: у PDF буде лише опис.`,
      });
  });
  return warnings;
}

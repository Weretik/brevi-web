import { describe, expect, it } from 'vitest';

import { quotePreviewWarnings } from './quote-preview-warnings';

import type { Quote, QuoteItem, QuotePrice } from '../entities/quote';

const price = (amount: number | null, shown = true): QuotePrice =>
  ({ amount, shown }) as unknown as QuotePrice;

const item = (id: number, photoUrl: string | null, prices: QuotePrice[]): QuoteItem =>
  ({
    id,
    name: `Виріб ${id}`,
    photoUrl,
    options: [{ prices: { retail: prices[0], wholesale: prices[1], large: prices[2] } }],
  }) as unknown as QuoteItem;

describe('quotePreviewWarnings', () => {
  it('names only the items the PDF will miss something of', () => {
    const quote = {
      items: [
        item(1, 'https://cdn.test/1.jpg', [price(100), price(90), price(80)]),
        item(2, null, [price(null, false), price(90), price(80)]),
        item(3, 'https://cdn.test/3.jpg', [price(100, false), price(0), price(null)]),
      ],
    } as unknown as Quote;

    expect(quotePreviewWarnings(quote).map((x) => x.title)).toEqual([
      'Позиція 02 без фото',
      'Позиція 03 не потрапить у PDF',
    ]);
  });
});

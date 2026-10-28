import { quotePriceErrors } from '@admin/clients/model';

import {
  quoteInteger,
  quotePositiveMoney,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuotePriceSelection } from '@admin/clients/model';

export function mapQuoteSelection(value: unknown): QuotePriceSelection {
  const row = quoteRecord(value);
  let selection: QuotePriceSelection;
  if (row['kind'] === 'sewing' && row['override'] == null && row['manualPrices'] == null)
    selection = {
      kind: 'sewing',
      productId: quoteInteger(row['productId']),
      articleId: quoteInteger(row['articleId']),
    };
  else if (row['kind'] === 'ppe' && row['articleId'] == null && row['manualPrices'] == null) {
    const override = row['override'] == null ? null : quoteRecord(row['override']);
    if (
      override &&
      !['retail', 'wholesale', 'largeWholesale'].includes(quoteText(override['tier']))
    )
      throw new Error('Невідомий рівень ціни КП.');
    selection = {
      kind: 'ppe',
      productId: quoteInteger(row['productId']),
      ...(override
        ? {
            override: {
              tier: override['tier'] as 'retail' | 'wholesale' | 'largeWholesale',
              amount: quotePositiveMoney(override['amount']),
              reason: quoteText(override['reason']),
            },
          }
        : {}),
    };
  } else if (
    row['kind'] === 'oneOffPpe' &&
    row['productId'] == null &&
    row['articleId'] == null &&
    row['override'] == null
  ) {
    const prices = quoteRecord(row['manualPrices']);
    selection = {
      kind: 'oneOffPpe',
      prices: {
        retail: quotePositiveMoney(prices['retail']),
        wholesale: quotePositiveMoney(prices['wholesale']),
        largeWholesale: quotePositiveMoney(prices['largeWholesale']),
        reason: quoteText(prices['reason']),
      },
    };
  } else throw new Error('Невідомий або несумісний тип позиції КП.');
  if (Object.keys(quotePriceErrors(selection)).length)
    throw new Error('Некоректна цінова основа КП.');
  return selection;
}

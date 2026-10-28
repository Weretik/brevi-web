import { mapQuoteBasis } from './quote-price.mapper';
import {
  quoteArray,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteMoney,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuoteVariantDraft } from '@admin/clients/model';

export function mapQuoteVariant(entry: unknown): QuoteVariantDraft {
  const variant = quoteRecord(entry);
  const id = quoteId(variant['publicId']);
  quoteInteger(variant['sortOrder'], 0);
  const basis = mapQuoteBasis(variant['priceBasis']);
  const selection = basis.selection;
  if (
    variant['kind'] !== selection.kind ||
    (variant['productId'] ?? null) !==
      (selection.kind === 'oneOffPpe' ? null : selection.productId) ||
    (variant['articleId'] ?? null) !== (selection.kind === 'sewing' ? selection.articleId : null)
  )
    throw new Error('Вибір варіанта не відповідає ціні.');
  const tiers = quoteArray(variant['tiers'], 3).map(quoteRecord);
  if (tiers.length !== 3 || new Set(tiers.map((tier) => tier['code'])).size !== 3)
    throw new Error('Мають бути три різні рівні ціни.');
  const visibility = { retail: false, wholesale: false, largeWholesale: false };
  for (const tier of tiers) {
    const code = quoteText(tier['code']);
    if (code !== 'retail' && code !== 'wholesale' && code !== 'largeWholesale')
      throw new Error('Невідомий рівень ціни.');
    if (tier['currency'] !== 'UAH' || quoteMoney(tier['amount']) !== basis[code])
      throw new Error('Рівень ціни не відповідає збереженій основі.');
    visibility[code] = quoteFlag(tier['visible']);
  }
  return {
    key: id,
    publicId: id,
    title: quoteText(variant['title']),
    visible: quoteFlag(variant['visible']),
    selection,
    basis: { origin: 'saved', value: basis },
    tierVisibility: visibility,
  };
}

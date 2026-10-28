import { mapQuoteVariant } from './quote-variant.mapper';
import { quoteOrderedRecords } from '../../validators/quotes/quote-ordered-records';
import {
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteNullableText,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuoteItemDraft } from '@admin/clients/model';

export function mapQuoteItem(entry: unknown): QuoteItemDraft {
  const item = quoteRecord(entry);
  const id = quoteId(item['publicId']);
  quoteInteger(item['sortOrder'], 0);
  const variants = quoteOrderedRecords(item['variants'], 30).map(mapQuoteVariant);
  if (new Set(variants.map((variant) => variant.key)).size !== variants.length)
    throw new Error('Повторний ідентифікатор варіанта.');
  return {
    key: id,
    publicId: id,
    title: quoteText(item['title']),
    included: quoteFlag(item['included']),
    publicDescription: quoteNullableText(item['publicDescription']) ?? '',
    publicComment: quoteNullableText(item['publicComment']) ?? '',
    internalNote: quoteNullableText(item['internalNote']) ?? '',
    variants,
  };
}

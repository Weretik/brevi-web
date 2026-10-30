import { mapQuoteItem } from './quote-item.mapper';
import { quoteOrderedRecords } from '../../validators/quotes/quote-ordered-records';
import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteNullableId,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';
import { quoteVersionAction } from '../../validators/quotes/quote-version-action';

import type { QuoteVersion } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function mapQuoteVersion(value: unknown): QuoteVersion {
  const version = quoteRecord(value);
  const action: operations['getCrmQuoteVersion']['responses'][200]['content']['application/json']['action'] =
    quoteVersionAction(version['action']);
  if (version['currency'] !== 'UAH' || version['taxBasis'] !== 'no_extra_vat')
    throw new Error('Невідома схема версії КП.');
  const items = quoteOrderedRecords(version['items'], 100).map(mapQuoteItem);
  const variantIds = items.flatMap((item) => item.variants.map((variant) => variant.key));
  if (
    new Set(items.map((item) => item.key)).size !== items.length ||
    new Set(variantIds).size !== variantIds.length
  )
    throw new Error('Повторні ідентифікатори у версії КП.');
  return {
    publicId: quoteId(version['publicId']),
    versionNumber: quoteInteger(version['versionNumber']),
    action,
    actorId: quoteInteger(version['actorId']),
    createdAt: quoteDate(version['createdAt']),
    draft: {
      customerId: quoteNullableId(version['customerPublicId']),
      contactId: quoteNullableId(version['contactPublicId']),
      recipientName: quoteText(version['recipientName']),
      items,
    },
  };
}

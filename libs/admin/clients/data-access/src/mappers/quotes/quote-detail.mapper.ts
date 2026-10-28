import { mapQuoteItem } from './quote-item.mapper';
import { quoteOrderedRecords } from '../../validators/quotes/quote-ordered-records';
import {
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteNullableId,
  quoteNullableText,
  quoteRecord,
  quoteState,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuoteDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Detail = operations['getCrmQuote']['responses'][200]['content']['application/json'];
export function mapQuoteDetail(value: unknown): QuoteDetail {
  const row = quoteRecord(value);
  const version = quoteRecord(row['version']);
  quoteId(version['publicId']);
  quoteInteger(version['actorId']);
  quoteDate(version['createdAt']);
  quoteDate(row['createdAt']);
  if (
    !['created', 'edited', 'recalculated', 'copied'].includes(quoteText(version['action'])) ||
    version['currency'] !== 'UAH' ||
    version['taxBasis'] !== 'no_extra_vat'
  )
    throw new Error('Невідома схема версії КП.');
  const items = quoteOrderedRecords(version['items'], 100).map(mapQuoteItem);
  const variantIds = items.flatMap((item) => item.variants.map((variant) => variant.key));
  if (
    new Set(items.map((item) => item.key)).size !== items.length ||
    new Set(variantIds).size !== variantIds.length
  )
    throw new Error('Повторні ідентифікатори у версії КП.');
  const state: Detail['state'] = quoteState(row['state']);
  return {
    publicId: quoteId(row['publicId']),
    revision: quoteInteger(row['revision']),
    versionNumber: quoteInteger(version['versionNumber']),
    state,
    archived: quoteFlag(row['archived']),
    number: quoteNullableText(row['number']),
    ownerId: quoteInteger(row['ownerId']),
    versionActorId: quoteInteger(version['actorId']),
    updatedAt: quoteDate(row['updatedAt']),
    canEdit: quoteFlag(row['canEdit']),
    draft: {
      customerId: quoteNullableId(version['customerPublicId']),
      contactId: quoteNullableId(version['contactPublicId']),
      recipientName: quoteText(version['recipientName']),
      items,
    },
  };
}

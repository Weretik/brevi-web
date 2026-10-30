import { mapQuoteResultPage } from './quote-result-page.mapper';
import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteNullableText,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';
import { quoteVersionAction } from '../../validators/quotes/quote-version-action';

import type { QuoteHistoryEvent, QuoteResultPage } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function mapQuoteEventPage(value: unknown): QuoteResultPage<QuoteHistoryEvent> {
  return mapQuoteResultPage(value, (value) => {
    const row = quoteRecord(value);
    const raw = quoteText(row['action']);
    const action: operations['getCrmQuoteEvents']['responses'][200]['content']['application/json']['value'][number]['action'] =
      raw === 'transferred' || raw === 'archived' || raw === 'restored'
        ? raw
        : quoteVersionAction(raw);
    return {
      publicId: quoteId(row['publicId']),
      revision: quoteInteger(row['revision']),
      versionNumber: quoteInteger(row['versionNumber']),
      action,
      actorId: quoteInteger(row['actorId']),
      ownerId: quoteInteger(row['ownerId']),
      previousOwnerId: row['previousOwnerId'] == null ? null : quoteInteger(row['previousOwnerId']),
      reason: quoteNullableText(row['reason']),
      createdAt: quoteDate(row['createdAt']),
    };
  });
}

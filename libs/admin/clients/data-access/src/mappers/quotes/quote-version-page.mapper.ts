import { mapQuoteResultPage } from './quote-result-page.mapper';
import {
  quoteDate,
  quoteId,
  quoteInteger,
  quoteNullableId,
  quoteRecord,
} from '../../validators/quotes/quote-response-values';
import { quoteVersionAction } from '../../validators/quotes/quote-version-action';

import type { QuoteResultPage, QuoteVersionSummary } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function mapQuoteVersionPage(value: unknown): QuoteResultPage<QuoteVersionSummary> {
  return mapQuoteResultPage(value, (value) => {
    const row = quoteRecord(value);
    const action: operations['getCrmQuoteVersions']['responses'][200]['content']['application/json']['value'][number]['action'] =
      quoteVersionAction(row['action']);
    return {
      publicId: quoteId(row['publicId']),
      versionNumber: quoteInteger(row['versionNumber']),
      action,
      actorId: quoteInteger(row['actorId']),
      createdAt: quoteDate(row['createdAt']),
      parentVersionId: quoteNullableId(row['parentVersionId']),
    };
  });
}

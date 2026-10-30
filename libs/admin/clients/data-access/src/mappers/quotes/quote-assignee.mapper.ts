import { mapQuoteResultPage } from './quote-result-page.mapper';
import {
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuoteAssignee, QuoteResultPage } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function mapQuoteAssigneePage(value: unknown): QuoteResultPage<QuoteAssignee> {
  return mapQuoteResultPage(value, (value) => {
    const row = quoteRecord(value);
    const result: operations['getCrmQuoteAssignees']['responses'][200]['content']['application/json']['value'][number] =
      { userId: quoteInteger(row['userId']), displayName: quoteText(row['displayName']) };
    return result;
  });
}

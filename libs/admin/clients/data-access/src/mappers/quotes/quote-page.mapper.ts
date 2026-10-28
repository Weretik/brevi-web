import {
  quoteArray,
  quoteDate,
  quoteFlag,
  quoteId,
  quoteInteger,
  quoteNullableText,
  quoteRecord,
  quoteState,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { QuotePage } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Page = operations['getCrmQuotes']['responses'][200]['content']['application/json'];
export function mapQuotePage(value: unknown): QuotePage {
  const row = quoteRecord(value);
  const page = quoteRecord(row['pagedInfo']);
  const info: Page['pagedInfo'] = {
    pageNumber: quoteInteger(page['pageNumber']),
    pageSize: quoteInteger(page['pageSize']),
    totalRecords: quoteInteger(page['totalRecords'], 0),
    totalPages: quoteInteger(page['totalPages'], 0),
  };
  return {
    rows: quoteArray(row['value']).map((entry) => {
      const item = quoteRecord(entry);
      return {
        publicId: quoteId(item['publicId']),
        recipientName: quoteText(item['recipientName']),
        revision: quoteInteger(item['revision']),
        versionNumber: quoteInteger(item['versionNumber']),
        state: quoteState(item['state']),
        archived: quoteFlag(item['archived']),
        number: quoteNullableText(item['number']),
        ownerId: quoteInteger(item['ownerId']),
        updatedAt: quoteDate(item['updatedAt']),
      };
    }),
    page: info.pageNumber,
    pageSize: info.pageSize,
    total: info.totalRecords,
    totalPages: info.totalPages,
  };
}

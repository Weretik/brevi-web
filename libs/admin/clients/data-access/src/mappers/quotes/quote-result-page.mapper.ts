import {
  quoteArray,
  quoteInteger,
  quoteRecord,
} from '../../validators/quotes/quote-response-values';

import type { QuoteResultPage } from '@admin/clients/model';

export function mapQuoteResultPage<T>(
  value: unknown,
  map: (row: unknown) => T,
): QuoteResultPage<T> {
  const row = quoteRecord(value);
  const info = quoteRecord(row['pagedInfo']);
  const pageSize = quoteInteger(info['pageSize']);
  if (pageSize > 100) throw new Error('Некоректний розмір сторінки КП.');
  return {
    rows: quoteArray(row['value'], pageSize).map(map),
    page: quoteInteger(info['pageNumber']),
    pageSize,
    total: quoteInteger(info['totalRecords'], 0),
    totalPages: quoteInteger(info['totalPages'], 0),
  };
}

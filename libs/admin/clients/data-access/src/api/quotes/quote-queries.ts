import { quoteApiError } from '../../errors/quotes/quote-api-error';
import { mapQuoteDetail } from '../../mappers/quotes/quote-detail.mapper';
import { mapQuotePage } from '../../mappers/quotes/quote-page.mapper';

import type { QuoteEndpointBuilder } from './quote-endpoint-builder';
import type { QuoteDetail, QuotePage } from '@admin/clients/model';

export function quoteQueries(build: QuoteEndpointBuilder) {
  return {
    listQuotes: build.query<
      QuotePage,
      {
        page: number;
        pageSize: number;
        search?: string;
        state?: 'draft' | 'ready' | 'sent';
        archived?: boolean;
      }
    >({
      query: (params) => ({ url: '/api/crm/quotes', params }),
      transformResponse: mapQuotePage,
      transformErrorResponse: quoteApiError,
      providesTags: (result) => [
        { type: 'Quote', id: 'LIST' },
        ...(result?.rows.map((row) => ({ type: 'Quote' as const, id: row.publicId })) ?? []),
      ],
    }),
    getQuote: build.query<QuoteDetail, string>({
      query: (id) => `/api/crm/quotes/${encodeURIComponent(id)}`,
      transformResponse: mapQuoteDetail,
      transformErrorResponse: quoteApiError,
      providesTags: (_result, _error, id) => [{ type: 'Quote', id }],
    }),
  };
}

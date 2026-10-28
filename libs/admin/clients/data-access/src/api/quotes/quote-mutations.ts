import { quoteApiError } from '../../errors/quotes/quote-api-error';
import { quoteContent } from '../../mappers/quotes/quote-content.mapper';
import { mapQuoteDetail } from '../../mappers/quotes/quote-detail.mapper';

import type { QuoteEndpointBuilder } from './quote-endpoint-builder';
import type { QuoteDetail, QuoteDraft } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function quoteMutations(build: QuoteEndpointBuilder) {
  return {
    createQuote: build.mutation<QuoteDetail, { draft: QuoteDraft; requestId: string }>({
      query: ({ draft, requestId }) => ({
        url: '/api/crm/quotes',
        method: 'POST',
        body: {
          requestId,
          customerPublicId: draft.customerId,
          contactPublicId: draft.contactId,
          recipientName: draft.recipientName,
          content: quoteContent(draft),
        } satisfies operations['createCrmQuote']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapQuoteDetail,
      transformErrorResponse: quoteApiError,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Quote', id: 'LIST' }]),
    }),
    saveQuoteVersion: build.mutation<
      QuoteDetail,
      { quoteId: string; revision: number; draft: QuoteDraft; requestId: string }
    >({
      query: ({ quoteId, revision, draft, requestId }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/versions`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          content: quoteContent(draft),
        } satisfies operations['saveCrmQuoteVersion']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapQuoteDetail,
      transformErrorResponse: quoteApiError,
      invalidatesTags: (_result, error, { quoteId }) =>
        error
          ? []
          : [
              { type: 'Quote', id: quoteId },
              { type: 'Quote', id: 'LIST' },
            ],
    }),
  };
}

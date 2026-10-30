import { quoteApiError } from '../../errors/quotes/quote-api-error';
import { mapQuoteAssigneePage } from '../../mappers/quotes/quote-assignee.mapper';
import { mapQuoteEventPage } from '../../mappers/quotes/quote-event-page.mapper';
import { mapQuoteVersionPage } from '../../mappers/quotes/quote-version-page.mapper';
import { mapQuoteVersion } from '../../mappers/quotes/quote-version.mapper';

import type { QuoteEndpointBuilder } from './quote-endpoint-builder';
import type {
  QuoteVersion,
  QuoteVersionSummary,
  QuoteHistoryEvent,
  QuoteAssignee,
  QuoteResultPage,
} from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type HistoryArgs = { quoteId: string; page: number; pageSize: number };
export function quoteHistoryQueries(build: QuoteEndpointBuilder) {
  return {
    getQuoteVersions: build.query<QuoteResultPage<QuoteVersionSummary>, HistoryArgs>({
      query: ({ quoteId, ...params }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/versions`,
        params: params satisfies NonNullable<
          operations['getCrmQuoteVersions']['parameters']['query']
        >,
      }),
      transformResponse: mapQuoteVersionPage,
      transformErrorResponse: quoteApiError,
      providesTags: (_data, _error, { quoteId }) => [{ type: 'Quote', id: quoteId }],
    }),
    getQuoteEvents: build.query<QuoteResultPage<QuoteHistoryEvent>, HistoryArgs>({
      query: ({ quoteId, ...params }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/events`,
        params: params satisfies NonNullable<
          operations['getCrmQuoteEvents']['parameters']['query']
        >,
      }),
      transformResponse: mapQuoteEventPage,
      transformErrorResponse: quoteApiError,
      providesTags: (_data, _error, { quoteId }) => [{ type: 'Quote', id: quoteId }],
    }),
    getQuoteVersion: build.query<QuoteVersion, { quoteId: string; versionId: string }>({
      query: ({ quoteId, versionId }) =>
        `/api/crm/quotes/${encodeURIComponent(quoteId)}/versions/${encodeURIComponent(versionId)}`,
      transformResponse: (value, _meta, args) => {
        const version = mapQuoteVersion(value);
        if (version.publicId !== args.versionId)
          throw new Error('Відповідь містить іншу версію КП.');
        return version;
      },
      transformErrorResponse: quoteApiError,
      providesTags: (_data, _error, { quoteId }) => [{ type: 'Quote', id: quoteId }],
    }),
    getQuoteAssignees: build.query<
      QuoteResultPage<QuoteAssignee>,
      { search: string; page: number; pageSize: number }
    >({
      query: (params) => ({
        url: '/api/crm/quote-assignees',
        params: params satisfies NonNullable<
          operations['getCrmQuoteAssignees']['parameters']['query']
        >,
      }),
      transformResponse: mapQuoteAssigneePage,
      transformErrorResponse: quoteApiError,
    }),
  };
}

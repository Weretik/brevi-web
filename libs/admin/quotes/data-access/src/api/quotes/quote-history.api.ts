import { apiCall, apiClient } from '@admin/shared/api-client';

import { quoteErrors, toQuoteApiError } from '../../errors/quote-api-error';
import { mapQuoteEvent } from '../../mappers/quote.mapper';
import { quotesBaseApi } from '../base/quotes-base-api';

import type { QuoteEvent, QuoteLegacyArchive, QuoteLegacyArchivePurge } from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const list = [{ type: 'QuoteList' as const, id: 'LIST' }];
const errors = (response: unknown) => toQuoteApiError(response, quoteErrors);

/** The history of a quote and the archive of the old calculator. */
export const quoteHistoryApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuoteHistory: build.query<readonly QuoteEvent[], number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quotes/{id}/history', { params: { path: { id: id } }, signal }),
          (value: Schemas['QuoteEventResponse'][]) => value.map(mapQuoteEvent),
          errors,
        ),
      providesTags: (_result, _error, id) => [{ type: 'QuoteHistory', id }],
    }),
    getQuoteLegacyArchive: build.query<QuoteLegacyArchive, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/crm/quotes/legacy-archive', { signal }), undefined, errors),
      providesTags: [{ type: 'QuoteLegacyArchive', id: 'COUNT' }],
    }),
    purgeQuoteLegacyArchive: build.mutation<QuoteLegacyArchivePurge, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.DELETE('/api/crm/quotes/legacy-archive', { signal }), undefined, errors),
      invalidatesTags: (_result, error) =>
        error ? [] : [...list, { type: 'QuoteLegacyArchive', id: 'COUNT' }],
    }),
  }),
});

export const {
  useGetQuoteHistoryQuery,
  useGetQuoteLegacyArchiveQuery,
  usePurgeQuoteLegacyArchiveMutation,
} = quoteHistoryApi;

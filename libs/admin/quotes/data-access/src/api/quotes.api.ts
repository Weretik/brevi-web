import { quotesBaseApi } from './quotes-base-api';
import { quoteErrors, toQuoteApiError } from '../errors/quote-api-error';
import { toSaveQuoteInput } from '../mappers/quote-input.mapper';
import { mapQuote, mapQuotePage, mapQuoteRepriceReport } from '../mappers/quote.mapper';

import type {
  Quote,
  QuoteDraft,
  QuoteListQuery,
  QuotePage,
  QuoteRepriceReport,
} from '@admin/quotes/model';

const list = [{ type: 'QuoteList' as const, id: 'LIST' }];
const errors = (response: unknown) => toQuoteApiError(response, quoteErrors);

export const quotesApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    listQuotes: build.query<QuotePage, QuoteListQuery>({
      query: (query) => ({
        url: '/api/crm/quotes',
        params: {
          search: query.search.trim() || undefined,
          responsibleUserId: query.responsibleUserId ?? undefined,
          page: query.page,
          pageSize: query.pageSize,
        },
      }),
      transformResponse: mapQuotePage,
      transformErrorResponse: errors,
      providesTags: list,
    }),
    getQuote: build.query<Quote, number>({
      query: (id) => `/api/crm/quotes/${id}`,
      transformResponse: mapQuote,
      transformErrorResponse: errors,
      providesTags: (_result, _error, id) => [{ type: 'Quote', id }],
    }),
    createQuote: build.mutation<Quote, QuoteDraft>({
      query: (draft) => ({ url: '/api/crm/quotes', method: 'POST', body: toSaveQuoteInput(draft) }),
      transformResponse: mapQuote,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    saveQuote: build.mutation<Quote, { id: number; draft: QuoteDraft }>({
      query: ({ id, draft }) => ({
        url: `/api/crm/quotes/${id}`,
        method: 'PUT',
        body: toSaveQuoteInput(draft),
      }),
      transformResponse: mapQuote,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    deleteQuote: build.mutation<void, { id: number; version: number }>({
      query: ({ id, version }) => ({
        url: `/api/crm/quotes/${id}`,
        method: 'DELETE',
        params: { version },
      }),
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    repriceQuote: build.mutation<
      QuoteRepriceReport,
      { id: number; version: number; apply: boolean }
    >({
      query: ({ id, version, apply }) => ({
        url: `/api/crm/quotes/${id}/reprice`,
        method: 'POST',
        body: { version, apply },
      }),
      transformResponse: mapQuoteRepriceReport,
      transformErrorResponse: errors,
      invalidatesTags: (result, error, { id }) =>
        error || !result?.applied ? [] : [...list, { type: 'Quote', id }],
    }),
    setQuoteResponsible: build.mutation<Quote, { id: number; version: number; userId: number }>({
      query: ({ id, version, userId }) => ({
        url: `/api/crm/quotes/${id}/responsible`,
        method: 'PUT',
        body: { version, userId },
      }),
      transformResponse: mapQuote,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
  }),
});

export const {
  useListQuotesQuery,
  useGetQuoteQuery,
  useLazyGetQuoteQuery,
  useCreateQuoteMutation,
  useSaveQuoteMutation,
  useDeleteQuoteMutation,
  useRepriceQuoteMutation,
  useSetQuoteResponsibleMutation,
} = quotesApi;

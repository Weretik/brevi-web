import { apiCall, apiClient } from '@admin/shared/api-client';

import { quoteErrors, toQuoteApiError } from '../../errors/quote-api-error';
import { toSaveQuoteInput } from '../../mappers/quote-input.mapper';
import {
  mapQuote,
  mapQuotePage,
  mapQuotePeriod,
  mapQuoteRepriceReport,
} from '../../mappers/quote.mapper';
import { quotesBaseApi } from '../base/quotes-base-api';

import type {
  Quote,
  QuoteDraft,
  QuoteListQuery,
  QuotePage,
  QuotePeriod,
  QuoteRepriceReport,
} from '@admin/quotes/model';

const list = [{ type: 'QuoteList' as const, id: 'LIST' }];
const errors = (response: unknown) => toQuoteApiError(response, quoteErrors);

export const quotesApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    listQuotes: build.query<QuotePage, QuoteListQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quotes', {
            params: {
              query: {
                search: query.search.trim() || undefined,
                responsibleUserId: query.responsibleUserId ?? undefined,
                page: query.page,
                pageSize: query.pageSize,
                customerId: query.customerId,
              },
            },
            signal,
          }),
          mapQuotePage,
          errors,
        ),
      providesTags: list,
    }),
    /** «КП за місяць»: `from`/`to` are Kyiv days; without them the current month. */
    getQuotePeriod: build.query<QuotePeriod, { from?: string; to?: string }>({
      queryFn: ({ from, to }, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quotes/period', { params: { query: { from, to } }, signal }),
          mapQuotePeriod,
          errors,
        ),
      providesTags: list,
    }),
    getQuote: build.query<Quote, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quotes/{id}', { params: { path: { id: id } }, signal }),
          mapQuote,
          errors,
        ),
      providesTags: (_result, _error, id) => [{ type: 'Quote', id }],
    }),
    /** `requestId` is one per attempt: a repeated press returns the same КП. */
    createQuote: build.mutation<Quote, { draft: QuoteDraft; requestId: string }>({
      queryFn: ({ draft, requestId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quotes', {
            body: { ...toSaveQuoteInput(draft), requestId },
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    saveQuote: build.mutation<Quote, { id: number; draft: QuoteDraft }>({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/quotes/{id}', {
            params: { path: { id: id } },
            body: toSaveQuoteInput(draft),
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    deleteQuote: build.mutation<void, { id: number; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/crm/quotes/{id}', {
            params: { path: { id: id }, query: { version } },
            signal,
          }),
          undefined,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    repriceQuote: build.mutation<
      QuoteRepriceReport,
      { id: number; version: number; apply: boolean }
    >({
      queryFn: ({ id, version, apply }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quotes/{id}/reprice', {
            params: { path: { id: id } },
            body: { version, apply },
            signal,
          }),
          mapQuoteRepriceReport,
          errors,
        ),
      invalidatesTags: (result, error, { id }) =>
        error || !result?.applied ? [] : [...list, { type: 'Quote', id }],
    }),
    setQuoteResponsible: build.mutation<Quote, { id: number; version: number; userId: number }>({
      queryFn: ({ id, version, userId }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/quotes/{id}/responsible', {
            params: { path: { id: id } },
            body: { version, userId },
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [...list, { type: 'QuoteHistory', id }],
    }),
    /** КП left from the removed «Архів»: their count for the Director (crm R-23). */
    /** The backend makes a new copy on every call; `requestId` is kept for the callers, it is not sent. */
    copyQuote: build.mutation<Quote, { id: number; requestId: string }>({
      queryFn: ({ id }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quotes/{id}/copy', {
            params: { path: { id } },
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    /** «Додати в КП» from «Ціна вишивки»: appends the saved calculation as one row. */
    addQuoteEmbroidery: build.mutation<Quote, { id: number; calculationId: number }>({
      queryFn: ({ id, calculationId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quotes/{id}/embroidery', {
            params: { path: { id: id } },
            body: { calculationId },
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [...list, { type: 'Quote', id }, { type: 'QuoteHistory', id }],
    }),
  }),
});

export const {
  useAddQuoteEmbroideryMutation,
  useListQuotesQuery,
  useGetQuotePeriodQuery,
  useGetQuoteQuery,
  useLazyGetQuoteQuery,
  useCreateQuoteMutation,
  useSaveQuoteMutation,
  useDeleteQuoteMutation,
  useRepriceQuoteMutation,
  useSetQuoteResponsibleMutation,
  useCopyQuoteMutation,
} = quotesApi;

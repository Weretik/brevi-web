import { apiCall, apiClient } from '@admin/shared/api-client';

import { quoteErrors, quoteLookupErrors, toQuoteApiError } from '../../errors/quote-api-error';
import {
  mapQuoteIntroductionSetup,
  mapQuoteIntroTemplate,
  mapQuoteIntroTemplates,
  toCreateQuoteIntroTemplateInput,
  toSaveQuoteIntroductionInput,
} from '../../mappers/quote-introduction.mapper';
import { mapQuote, mapQuoteCatalogProduct } from '../../mappers/quote.mapper';
import { quotesBaseApi } from '../base/quotes-base-api';

import type {
  Quote,
  QuoteCatalogProduct,
  QuoteIntroDraft,
  QuoteIntroductionSetup,
  QuoteIntroTemplate,
} from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const list = [{ type: 'QuoteList' as const, id: 'LIST' }];
const templates = [{ type: 'QuoteIntroTemplates' as const, id: 'LIST' }];
const errors = (response: unknown) => toQuoteApiError(response, quoteErrors);
const lookupErrors = (response: unknown) => toQuoteApiError(response, quoteLookupErrors);
const templateErrors = (response: unknown) =>
  toQuoteApiError(response, {
    unauthorized: 'Видалити шаблон може його автор, директор або адміністратор.',
    notFound: 'Шаблон вже видалено.',
    fallback: 'Не вдалося зберегти шаблон. Спробуйте ще раз.',
  });

/** «КП для знайомства» (R-16–R-18) and «Готові шаблони» (R-19). */
export const quoteIntroductionsApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuoteIntroductionSetup: build.query<QuoteIntroductionSetup, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-lookups/introduction', { signal }),
          mapQuoteIntroductionSetup,
          lookupErrors,
        ),
    }),
    getQuoteCatalogProducts: build.query<QuoteCatalogProduct[], readonly number[]>({
      queryFn: (ids, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-lookups/products', {
            params: { query: { ids: [...ids] } },
            signal,
          }),
          (value: Schemas['QuoteCatalogProductResponse'][]) => value.map(mapQuoteCatalogProduct),
          lookupErrors,
        ),
    }),
    /** `requestId` is one per attempt: a repeated press returns the same КП. */
    createQuoteIntroduction: build.mutation<Quote, { draft: QuoteIntroDraft; requestId: string }>({
      queryFn: ({ draft, requestId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quote-introductions', {
            body: { ...toSaveQuoteIntroductionInput(draft), requestId },
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    saveQuoteIntroduction: build.mutation<Quote, { id: number; draft: QuoteIntroDraft }>({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/quote-introductions/{id}', {
            params: { path: { id: id } },
            body: toSaveQuoteIntroductionInput(draft),
            signal,
          }),
          mapQuote,
          errors,
        ),
      invalidatesTags: (_result, error, { id }) => (error ? [] : [...list, { type: 'Quote', id }]),
    }),
    getQuoteIntroTemplates: build.query<QuoteIntroTemplate[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-intro-templates', { signal }),
          mapQuoteIntroTemplates,
          lookupErrors,
        ),
      providesTags: templates,
    }),
    createQuoteIntroTemplate: build.mutation<
      QuoteIntroTemplate,
      { name: string; draft: QuoteIntroDraft }
    >({
      queryFn: ({ name, draft }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quote-intro-templates', {
            body: toCreateQuoteIntroTemplateInput(name, draft),
            signal,
          }),
          mapQuoteIntroTemplate,
          templateErrors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : templates),
    }),
    deleteQuoteIntroTemplate: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/crm/quote-intro-templates/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          templateErrors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : templates),
    }),
  }),
});

export const {
  useGetQuoteIntroductionSetupQuery,
  useGetQuoteCatalogProductsQuery,
  useLazyGetQuoteCatalogProductsQuery,
  useCreateQuoteIntroductionMutation,
  useSaveQuoteIntroductionMutation,
  useGetQuoteIntroTemplatesQuery,
  useCreateQuoteIntroTemplateMutation,
  useDeleteQuoteIntroTemplateMutation,
} = quoteIntroductionsApi;

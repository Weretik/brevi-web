import { quotesBaseApi } from './quotes-base-api';
import { quoteErrors, quoteLookupErrors, toQuoteApiError } from '../errors/quote-api-error';
import {
  mapQuoteIntroductionSetup,
  mapQuoteIntroTemplate,
  mapQuoteIntroTemplates,
  toCreateQuoteIntroTemplateInput,
  toSaveQuoteIntroductionInput,
} from '../mappers/quote-introduction.mapper';
import { mapQuote, mapQuoteCatalogProduct } from '../mappers/quote.mapper';

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
      query: () => '/api/crm/quote-lookups/introduction',
      transformResponse: mapQuoteIntroductionSetup,
      transformErrorResponse: lookupErrors,
    }),
    getQuoteCatalogProducts: build.query<QuoteCatalogProduct[], readonly number[]>({
      query: (ids) => ({ url: '/api/crm/quote-lookups/products', params: { ids: [...ids] } }),
      transformResponse: (value: Schemas['CrmQuoteCatalogProduct'][]) =>
        value.map(mapQuoteCatalogProduct),
      transformErrorResponse: lookupErrors,
    }),
    createQuoteIntroduction: build.mutation<Quote, QuoteIntroDraft>({
      query: (draft) => ({
        url: '/api/crm/quote-introductions',
        method: 'POST',
        body: toSaveQuoteIntroductionInput(draft),
      }),
      transformResponse: mapQuote,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
    saveQuoteIntroduction: build.mutation<Quote, { id: number; draft: QuoteIntroDraft }>({
      query: ({ id, draft }) => ({
        url: `/api/crm/quote-introductions/${id}`,
        method: 'PUT',
        body: toSaveQuoteIntroductionInput(draft),
      }),
      transformResponse: mapQuote,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error, { id }) => (error ? [] : [...list, { type: 'Quote', id }]),
    }),
    getQuoteIntroTemplates: build.query<QuoteIntroTemplate[], void>({
      query: () => '/api/crm/quote-intro-templates',
      transformResponse: mapQuoteIntroTemplates,
      transformErrorResponse: lookupErrors,
      providesTags: templates,
    }),
    createQuoteIntroTemplate: build.mutation<
      QuoteIntroTemplate,
      { name: string; draft: QuoteIntroDraft }
    >({
      query: ({ name, draft }) => ({
        url: '/api/crm/quote-intro-templates',
        method: 'POST',
        body: toCreateQuoteIntroTemplateInput(name, draft),
      }),
      transformResponse: mapQuoteIntroTemplate,
      transformErrorResponse: templateErrors,
      invalidatesTags: (_result, error) => (error ? [] : templates),
    }),
    deleteQuoteIntroTemplate: build.mutation<void, number>({
      query: (id) => ({ url: `/api/crm/quote-intro-templates/${id}`, method: 'DELETE' }),
      transformErrorResponse: templateErrors,
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

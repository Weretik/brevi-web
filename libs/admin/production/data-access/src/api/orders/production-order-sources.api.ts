import { apiCall, apiClient } from '@admin/shared/api-client';

import { productionOrderErrors, toProductionApiError } from '../../errors/production-api-error';
import { mapProductionEmbroideryChoices } from '../../mappers/orders/card/production-application.mapper';
import { productionColors } from '../../mappers/orders/card/production-order.mapper';
import { mapOrderImportResult } from '../../mappers/orders/sources/production-import.mapper';
import {
  mapProductionQuoteDraft,
  mapProductionQuoteSources,
} from '../../mappers/orders/sources/production-quote-draft.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  ProductionEmbroideryChoice,
  ProductionImportResult,
  ProductionOrderImportRow,
  ProductionQuoteDraft,
  ProductionQuoteSource,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The import rows must stay assignable to the backend contract. */
const importInput = (rows: ProductionOrderImportRow[]): Schemas['ProductionOrderImportRow'][] =>
  rows;
const errors = (response: unknown) => toProductionApiError(response, productionOrderErrors);
const list = { type: 'ProductionOrder' as const, id: 'LIST' };

export const productionOrderSourcesApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductionQuoteSources: build.query<ProductionQuoteSource[], string>({
      queryFn: (search, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/quote-sources', {
            params: { query: search.trim() ? { search: search.trim() } : {} },
            signal,
          }),
          mapProductionQuoteSources,
          errors,
        ),
      providesTags: [list],
    }),
    getProductionEmbroideries: build.query<ProductionEmbroideryChoice[], string>({
      queryFn: (search, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/embroideries', {
            params: { query: search.trim() ? { search: search.trim() } : {} },
            signal,
          }),
          mapProductionEmbroideryChoices,
          errors,
        ),
    }),
    /** Colours of «Кольори» for the item form. */
    getProductionColors: build.query<string[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/colors', { signal }),
          productionColors,
          errors,
        ),
    }),
    getProductionQuoteDraft: build.query<ProductionQuoteDraft, number>({
      queryFn: (quoteId, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/quote-sources/{quoteId}', {
            params: { path: { quoteId: quoteId } },
            signal,
          }),
          mapProductionQuoteDraft,
          errors,
        ),
    }),
    importProductionOrders: build.mutation<
      ProductionImportResult,
      { rows: ProductionOrderImportRow[]; dryRun: boolean }
    >({
      queryFn: ({ rows, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/import', {
            params: { query: { dryRun } },
            body: importInput(rows),
            signal,
          }),
          mapOrderImportResult,
          errors,
        ),
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : [list],
    }),
  }),
});

export const {
  useGetProductionColorsQuery,
  useGetProductionEmbroideriesQuery,
  useGetProductionQuoteDraftQuery,
  useGetProductionQuoteSourcesQuery,
  useImportProductionOrdersMutation,
} = productionOrderSourcesApi;

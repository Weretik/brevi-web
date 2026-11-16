import { apiCall, apiClient } from '@admin/shared/api-client';

import { productionOrderErrors, toProductionApiError } from '../../errors/production-api-error';
import { mapOrderImportResult } from '../../mappers/orders/production-import.mapper';
import {
  mapProductionModelSummary,
  mapProductionOrderFilterOptions,
} from '../../mappers/orders/production-order-filters.mapper';
import {
  mapProductionEmbroideryChoices,
  mapProductionOrder,
  mapProductionOrderHistory,
  mapProductionOrderPage,
  mapProductionQuoteDraft,
  mapProductionQuoteSources,
  productionColors,
} from '../../mappers/orders/production-order.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  CreateProductionOrderBody,
  ProductionEmbroideryChoice,
  ProductionImportResult,
  ProductionOrder,
  ProductionModelSummary,
  ProductionOrderChange,
  ProductionOrderFilterOptions,
  ProductionOrderImportRow,
  ProductionOrderListQuery,
  ProductionOrderPage,
  ProductionQuoteDraft,
  ProductionQuoteSource,
  UpdateProductionOrderBody,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const createInput = (body: CreateProductionOrderBody): Schemas['CreateProductionOrderInput'] =>
  body;
const updateInput = (body: UpdateProductionOrderBody): Schemas['UpdateProductionOrderInput'] =>
  body;
const importInput = (rows: ProductionOrderImportRow[]): Schemas['ProductionOrderImportRow'][] =>
  rows;

const errors = (response: unknown) => toProductionApiError(response, productionOrderErrors);
const list = { type: 'ProductionOrder' as const, id: 'LIST' };
const one = (id: number) => ({ type: 'ProductionOrder' as const, id });

function filterParams(query: ProductionOrderListQuery) {
  const filters = query.filters;
  const params: Record<string, string> = {};
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      const trimmed = value?.trim();
      if (trimmed) params[key] = trimmed;
    }
  }
  return {
    ...(query.search.trim() ? { search: query.search.trim() } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.manager ? { manager: query.manager } : {}),
    ...(query.dueTo ? { dueTo: query.dueTo } : {}),
    ...(query.stage ? { stage: query.stage } : {}),
    ...params,
  };
}

function listParams(query: ProductionOrderListQuery) {
  return {
    page: query.page,
    pageSize: query.pageSize,
    ...(query.sort ? { sort: query.sort } : {}),
    ...filterParams(query),
    ...(query.customerId ? { customerId: query.customerId } : {}),
    ...(query.quoteId ? { quoteId: query.quoteId } : {}),
    ...(query.managerUserId ? { managerUserId: query.managerUserId } : {}),
  };
}

export const productionOrdersApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductionOrders: build.query<ProductionOrderPage, ProductionOrderListQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders', { params: { query: listParams(query) }, signal }),
          mapProductionOrderPage,
          errors,
        ),
      providesTags: [list],
    }),
    getProductionModelSummary: build.query<ProductionModelSummary, ProductionOrderListQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/model-summary', {
            params: { query: filterParams(query) },
            signal,
          }),
          mapProductionModelSummary,
          errors,
        ),
      providesTags: [list],
    }),
    getProductionOrderFilterOptions: build.query<ProductionOrderFilterOptions, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/filter-options', { signal }),
          mapProductionOrderFilterOptions,
          errors,
        ),
      providesTags: [list],
    }),
    getProductionOrder: build.query<ProductionOrder, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/{id}', { params: { path: { id: id } }, signal }),
          mapProductionOrder,
          errors,
        ),
      providesTags: (_result, _error, id) => [one(id)],
    }),
    getProductionOrderHistory: build.query<ProductionOrderChange[], number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/orders/{id}/history', {
            params: { path: { id: id } },
            signal,
          }),
          mapProductionOrderHistory,
          errors,
        ),
      providesTags: (_result, _error, id) => [one(id)],
    }),
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
    createProductionOrder: build.mutation<ProductionOrder, CreateProductionOrderBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders', { body: createInput(body), signal }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [list]),
    }),
    updateProductionOrder: build.mutation<
      ProductionOrder,
      { id: number; body: UpdateProductionOrderBody }
    >({
      queryFn: ({ id, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/orders/{id}', {
            params: { path: { id: id } },
            body: updateInput(body),
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: (_result, error, { id }) => (error ? [] : [list, one(id)]),
    }),
    copyProductionOrder: build.mutation<ProductionOrder, { id: number; requestId: string }>({
      queryFn: ({ id, requestId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/{id}/copy', {
            params: { path: { id: id } },
            body: { requestId },
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [list]),
    }),
    deleteProductionOrder: build.mutation<void, { id: number; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/production/orders/{id}', {
            params: { path: { id: id }, query: { version } },
            signal,
          }),
          undefined,
          errors,
        ),
      invalidatesTags: (_result, error, { id }) => (error ? [] : [list, one(id)]),
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
  useCopyProductionOrderMutation,
  useCreateProductionOrderMutation,
  useDeleteProductionOrderMutation,
  useGetProductionColorsQuery,
  useGetProductionEmbroideriesQuery,
  useGetProductionModelSummaryQuery,
  useGetProductionOrderFilterOptionsQuery,
  useGetProductionOrderHistoryQuery,
  useGetProductionOrderQuery,
  useGetProductionOrdersQuery,
  useGetProductionQuoteDraftQuery,
  useGetProductionQuoteSourcesQuery,
  useImportProductionOrdersMutation,
  useLazyGetProductionOrdersQuery,
  useUpdateProductionOrderMutation,
} = productionOrdersApi;

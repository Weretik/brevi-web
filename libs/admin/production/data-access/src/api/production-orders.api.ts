import { productionBaseApi } from './production-base-api';
import { productionOrderErrors, toProductionApiError } from '../errors/production-api-error';
import { mapOrderImportResult } from '../mappers/production-import.mapper';
import {
  mapProductionEmbroideryChoices,
  mapProductionOrder,
  mapProductionOrderHistory,
  mapProductionOrderPage,
  mapProductionQuoteDraft,
  mapProductionQuoteSources,
} from '../mappers/production-order.mapper';

import type {
  CreateProductionOrderBody,
  ProductionEmbroideryChoice,
  ProductionImportResult,
  ProductionOrder,
  ProductionOrderChange,
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

function listParams(query: ProductionOrderListQuery) {
  return {
    page: query.page,
    pageSize: query.pageSize,
    ...(query.search.trim() ? { search: query.search.trim() } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.manager ? { manager: query.manager } : {}),
    ...(query.dueTo ? { dueTo: query.dueTo } : {}),
    ...(query.stage ? { stage: query.stage } : {}),
  };
}

export const productionOrdersApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductionOrders: build.query<ProductionOrderPage, ProductionOrderListQuery>({
      query: (query) => ({ url: '/api/production/orders', params: listParams(query) }),
      transformResponse: mapProductionOrderPage,
      transformErrorResponse: errors,
      providesTags: [list],
    }),
    getProductionOrder: build.query<ProductionOrder, number>({
      query: (id) => `/api/production/orders/${id}`,
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      providesTags: (_result, _error, id) => [one(id)],
    }),
    getProductionOrderHistory: build.query<ProductionOrderChange[], number>({
      query: (id) => `/api/production/orders/${id}/history`,
      transformResponse: mapProductionOrderHistory,
      transformErrorResponse: errors,
      providesTags: (_result, _error, id) => [one(id)],
    }),
    getProductionQuoteSources: build.query<ProductionQuoteSource[], string>({
      query: (search) => ({
        url: '/api/production/orders/quote-sources',
        params: search.trim() ? { search: search.trim() } : {},
      }),
      transformResponse: mapProductionQuoteSources,
      transformErrorResponse: errors,
      providesTags: [list],
    }),
    getProductionEmbroideries: build.query<ProductionEmbroideryChoice[], string>({
      query: (search) => ({
        url: '/api/production/orders/embroideries',
        params: search.trim() ? { search: search.trim() } : {},
      }),
      transformResponse: mapProductionEmbroideryChoices,
      transformErrorResponse: errors,
    }),
    getProductionQuoteDraft: build.query<ProductionQuoteDraft, number>({
      query: (quoteId) => `/api/production/orders/quote-sources/${quoteId}`,
      transformResponse: mapProductionQuoteDraft,
      transformErrorResponse: errors,
    }),
    createProductionOrder: build.mutation<ProductionOrder, CreateProductionOrderBody>({
      query: (body) => ({ url: '/api/production/orders', method: 'POST', body: createInput(body) }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : [list]),
    }),
    updateProductionOrder: build.mutation<
      ProductionOrder,
      { id: number; body: UpdateProductionOrderBody }
    >({
      query: ({ id, body }) => ({
        url: `/api/production/orders/${id}`,
        method: 'PUT',
        body: updateInput(body),
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error, { id }) => (error ? [] : [list, one(id)]),
    }),
    copyProductionOrder: build.mutation<ProductionOrder, { id: number; requestId: string }>({
      query: ({ id, requestId }) => ({
        url: `/api/production/orders/${id}/copy`,
        method: 'POST',
        body: { requestId },
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : [list]),
    }),
    deleteProductionOrder: build.mutation<void, { id: number; version: number }>({
      query: ({ id, version }) => ({
        url: `/api/production/orders/${id}`,
        method: 'DELETE',
        params: { version },
      }),
      transformErrorResponse: errors,
      invalidatesTags: (_result, error, { id }) => (error ? [] : [list, one(id)]),
    }),
    importProductionOrders: build.mutation<
      ProductionImportResult,
      { rows: ProductionOrderImportRow[]; dryRun: boolean }
    >({
      query: ({ rows, dryRun }) => ({
        url: '/api/production/orders/import',
        method: 'POST',
        params: { dryRun },
        body: importInput(rows),
      }),
      transformResponse: mapOrderImportResult,
      transformErrorResponse: errors,
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : [list],
    }),
  }),
});

export const {
  useCopyProductionOrderMutation,
  useCreateProductionOrderMutation,
  useDeleteProductionOrderMutation,
  useGetProductionEmbroideriesQuery,
  useGetProductionOrderHistoryQuery,
  useGetProductionOrderQuery,
  useGetProductionOrdersQuery,
  useGetProductionQuoteDraftQuery,
  useGetProductionQuoteSourcesQuery,
  useImportProductionOrdersMutation,
  useLazyGetProductionOrdersQuery,
  useUpdateProductionOrderMutation,
} = productionOrdersApi;

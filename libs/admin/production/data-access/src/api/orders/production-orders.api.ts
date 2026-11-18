import { apiCall, apiClient } from '@admin/shared/api-client';

import { productionOrderErrors, toProductionApiError } from '../../errors/production-api-error';
import {
  mapProductionOrder,
  mapProductionOrderHistory,
} from '../../mappers/orders/card/production-order.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  CreateProductionOrderBody,
  ProductionOrder,
  ProductionOrderChange,
  UpdateProductionOrderBody,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const createInput = (body: CreateProductionOrderBody): Schemas['CreateProductionOrderInput'] =>
  body;
const updateInput = (body: UpdateProductionOrderBody): Schemas['UpdateProductionOrderInput'] =>
  body;

const errors = (response: unknown) => toProductionApiError(response, productionOrderErrors);
const list = { type: 'ProductionOrder' as const, id: 'LIST' };
const one = (id: number) => ({ type: 'ProductionOrder' as const, id });

export const productionOrdersApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const {
  useCopyProductionOrderMutation,
  useCreateProductionOrderMutation,
  useDeleteProductionOrderMutation,
  useGetProductionOrderHistoryQuery,
  useGetProductionOrderQuery,
  useUpdateProductionOrderMutation,
} = productionOrdersApi;

import { apiCall, apiClient } from '@admin/shared/api-client';

import { productionOrderErrors, toProductionApiError } from '../../errors/production-api-error';
import {
  mapProductionModelSummary,
  mapProductionOrderFilterOptions,
} from '../../mappers/orders/list/production-order-filters.mapper';
import { mapProductionOrderPage } from '../../mappers/orders/list/production-order-page.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  ProductionModelSummary,
  ProductionOrderFilterOptions,
  ProductionOrderListQuery,
  ProductionOrderPage,
} from '@admin/production/model';

const errors = (response: unknown) => toProductionApiError(response, productionOrderErrors);
const list = { type: 'ProductionOrder' as const, id: 'LIST' };

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

export const productionOrderListApi = productionBaseApi.injectEndpoints({
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
  }),
});

export const {
  useGetProductionModelSummaryQuery,
  useGetProductionOrderFilterOptionsQuery,
  useGetProductionOrdersQuery,
  useLazyGetProductionOrdersQuery,
} = productionOrderListApi;

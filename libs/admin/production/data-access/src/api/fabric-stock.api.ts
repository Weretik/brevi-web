import { productionBaseApi } from './production-base-api';
import { fabricStockErrors, toProductionApiError } from '../errors/production-api-error';
import { mapFabricStockChoices, mapProductionItemFabric } from '../mappers/fabric-stock.mapper';

import type {
  CreateFabricIssueBody,
  FabricStockChoices,
  ProductionItemFabric,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const issueInput = (body: CreateFabricIssueBody): Schemas['CreateFabricIssueInput'] => body;

const errors = (response: unknown) => toProductionApiError(response, fabricStockErrors);
/** An issue moves «Склад тканин» and writes a line of the order's «Історія змін». */
const issueChanged = (_result: unknown, error: unknown, { orderId }: { orderId: number }) =>
  error
    ? []
    : [
        { type: 'FabricStock' as const },
        { type: 'FabricMovement' as const },
        { type: 'ItemFabric' as const },
        { type: 'ProductionOrder' as const, id: orderId },
      ];

export const fabricStockApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getIssueFabricChoices: build.query<FabricStockChoices, void>({
      query: () => '/api/warehouse/fabric-stock/choices',
      transformResponse: mapFabricStockChoices,
      transformErrorResponse: errors,
    }),
    getProductionItemFabric: build.query<ProductionItemFabric, { orderId: number; itemId: number }>(
      {
        query: ({ orderId, itemId }) => `/api/warehouse/orders/${orderId}/items/${itemId}/fabric`,
        transformResponse: mapProductionItemFabric,
        transformErrorResponse: errors,
        providesTags: (_result, _error, { itemId }) => [{ type: 'ItemFabric', id: itemId }],
      },
    ),
    createFabricIssue: build.mutation<
      ProductionItemFabric,
      { orderId: number; itemId: number; body: CreateFabricIssueBody }
    >({
      query: ({ orderId, itemId, body }) => ({
        url: `/api/warehouse/orders/${orderId}/items/${itemId}/fabric-issues`,
        method: 'POST',
        body: issueInput(body),
      }),
      transformResponse: mapProductionItemFabric,
      transformErrorResponse: errors,
      invalidatesTags: issueChanged,
    }),
    reverseFabricIssue: build.mutation<
      ProductionItemFabric,
      { orderId: number; issueId: number; orderVersion: number; reason: string }
    >({
      query: ({ orderId, issueId, orderVersion, reason }) => ({
        url: `/api/warehouse/orders/${orderId}/fabric-issues/${issueId}/reverse`,
        method: 'POST',
        body: { orderVersion, reason } satisfies Schemas['ReverseFabricIssueInput'],
      }),
      transformResponse: mapProductionItemFabric,
      transformErrorResponse: errors,
      invalidatesTags: issueChanged,
    }),
  }),
});

export const {
  useCreateFabricIssueMutation,
  useGetIssueFabricChoicesQuery,
  useGetProductionItemFabricQuery,
  useReverseFabricIssueMutation,
} = fabricStockApi;

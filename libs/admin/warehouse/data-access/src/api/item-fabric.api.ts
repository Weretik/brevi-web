import { apiCall, apiClient } from '@admin/shared/api-client';

import { warehouseBaseApi } from './warehouse-base-api';
import { warehouseApiError } from '../errors/warehouse-api-error';
import { mapFabricIssueItems, mapItemFabric } from '../mappers/item-fabric.mapper';

import type { components } from '@admin/shared/contracts';
import type {
  CreateItemIssueBody,
  FabricIssueItems,
  ItemFabric,
  RefreshItemPlanBody,
} from '@admin/warehouse/model';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const issueInput = (body: CreateItemIssueBody): Schemas['CreateFabricIssueInput'] => body;
const refreshInput = (body: RefreshItemPlanBody): Schemas['RefreshItemFabricPlanInput'] => body;

/**
 * Where the card is read: «orders» for the «Тканина» tab of «Виробничі завдання» (orders access),
 * «stock» for «Видача на завдання» of «Склад тканин» (stock access).
 */
export type ItemFabricScope = 'orders' | 'stock';

interface ItemRef {
  orderId: number;
  itemId: number;
}

/** An issue or a plan change moves the stock, the card and the order's «Історія змін». */
const itemChanged = (_result: unknown, error: unknown, { orderId }: { orderId: number }) =>
  error
    ? []
    : [
        { type: 'FabricStock' as const },
        { type: 'FabricMovement' as const },
        { type: 'ItemFabric' as const },
        { type: 'ProductionOrder' as const, id: orderId },
      ];

export const itemFabricApi = warehouseBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getFabricIssueItems: build.query<FabricIssueItems, string>({
      queryFn: (search, { signal }) =>
        apiCall(
          apiClient.GET('/api/warehouse/fabric-stock/issue-items', {
            params: { query: search.trim() ? { search: search.trim() } : {} },
            signal,
          }),
          mapFabricIssueItems,
          warehouseApiError,
        ),
      providesTags: [{ type: 'ItemFabric', id: 'SEARCH' }],
    }),
    getItemFabric: build.query<ItemFabric, ItemRef & { scope: ItemFabricScope }>({
      queryFn: ({ orderId, itemId, scope }, { signal }) => {
        return apiCall(
          scope === 'orders'
            ? apiClient.GET('/api/warehouse/orders/{id}/items/{itemId}/fabric', {
                params: { path: { id: orderId, itemId } },
                signal,
              })
            : apiClient.GET('/api/warehouse/fabric-stock/issue-items/{orderId}/{itemId}', {
                params: { path: { orderId, itemId } },
                signal,
              }),
          mapItemFabric,
          warehouseApiError,
        );
      },
      providesTags: (_result, _error, { itemId }) => [{ type: 'ItemFabric', id: itemId }],
    }),
    issueFabricToItem: build.mutation<ItemFabric, ItemRef & { body: CreateItemIssueBody }>({
      queryFn: ({ orderId, itemId, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/issue-items/{orderId}/{itemId}/issues', {
            params: { path: { orderId: orderId, itemId: itemId } },
            body: issueInput(body),
            signal,
          }),
          mapItemFabric,
          warehouseApiError,
        ),
      invalidatesTags: itemChanged,
    }),
    refreshItemFabricPlan: build.mutation<ItemFabric, ItemRef & { body: RefreshItemPlanBody }>({
      queryFn: ({ orderId, itemId, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/issue-items/{orderId}/{itemId}/plan', {
            params: { path: { orderId: orderId, itemId: itemId } },
            body: refreshInput(body),
            signal,
          }),
          mapItemFabric,
          warehouseApiError,
        ),
      invalidatesTags: itemChanged,
    }),
    reverseFabricIssue: build.mutation<
      ItemFabric,
      { orderId: number; issueId: number; orderVersion: number; reason: string }
    >({
      queryFn: ({ orderId, issueId, orderVersion, reason }, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/orders/{id}/fabric-issues/{issueId}/reverse', {
            params: { path: { id: orderId, issueId: issueId } },
            body: { orderVersion, reason } satisfies Schemas['ReverseFabricIssueInput'],
            signal,
          }),
          mapItemFabric,
          warehouseApiError,
        ),
      invalidatesTags: itemChanged,
    }),
  }),
});

export const {
  useGetFabricIssueItemsQuery,
  useGetItemFabricQuery,
  useIssueFabricToItemMutation,
  useRefreshItemFabricPlanMutation,
  useReverseFabricIssueMutation,
} = itemFabricApi;

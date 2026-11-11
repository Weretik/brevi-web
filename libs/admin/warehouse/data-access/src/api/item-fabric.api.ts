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

const cardUrl = ({ orderId, itemId, scope }: ItemRef & { scope: ItemFabricScope }) =>
  scope === 'orders'
    ? `/api/warehouse/orders/${orderId}/items/${itemId}/fabric`
    : `/api/warehouse/fabric-stock/issue-items/${orderId}/${itemId}`;

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
      query: (search) => ({
        url: '/api/warehouse/fabric-stock/issue-items',
        params: search.trim() ? { search: search.trim() } : {},
      }),
      transformResponse: mapFabricIssueItems,
      transformErrorResponse: warehouseApiError,
      providesTags: [{ type: 'ItemFabric', id: 'SEARCH' }],
    }),
    getItemFabric: build.query<ItemFabric, ItemRef & { scope: ItemFabricScope }>({
      query: cardUrl,
      transformResponse: mapItemFabric,
      transformErrorResponse: warehouseApiError,
      providesTags: (_result, _error, { itemId }) => [{ type: 'ItemFabric', id: itemId }],
    }),
    issueFabricToItem: build.mutation<ItemFabric, ItemRef & { body: CreateItemIssueBody }>({
      query: ({ orderId, itemId, body }) => ({
        url: `/api/warehouse/fabric-stock/issue-items/${orderId}/${itemId}/issues`,
        method: 'POST',
        body: issueInput(body),
      }),
      transformResponse: mapItemFabric,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: itemChanged,
    }),
    refreshItemFabricPlan: build.mutation<ItemFabric, ItemRef & { body: RefreshItemPlanBody }>({
      query: ({ orderId, itemId, body }) => ({
        url: `/api/warehouse/fabric-stock/issue-items/${orderId}/${itemId}/plan`,
        method: 'POST',
        body: refreshInput(body),
      }),
      transformResponse: mapItemFabric,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: itemChanged,
    }),
    reverseFabricIssue: build.mutation<
      ItemFabric,
      { orderId: number; issueId: number; orderVersion: number; reason: string }
    >({
      query: ({ orderId, issueId, orderVersion, reason }) => ({
        url: `/api/warehouse/orders/${orderId}/fabric-issues/${issueId}/reverse`,
        method: 'POST',
        body: { orderVersion, reason } satisfies Schemas['ReverseFabricIssueInput'],
      }),
      transformResponse: mapItemFabric,
      transformErrorResponse: warehouseApiError,
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

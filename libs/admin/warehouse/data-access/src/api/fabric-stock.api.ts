import { warehouseBaseApi } from './warehouse-base-api';
import { warehouseApiError } from '../errors/warehouse-api-error';
import {
  mapFabricConsumption,
  mapFabricMovementPage,
  mapFabricStockChoices,
  mapFabricStockList,
  mapFabricStockOperation,
} from '../mappers/fabric-stock.mapper';

import type { components } from '@admin/shared/contracts';
import type {
  AdjustFabricStockBody,
  FabricConsumption,
  FabricMovementPage,
  FabricMovementQuery,
  FabricStockChoices,
  FabricStockList,
  FabricStockOperationResult,
  IssueFabricBody,
  OpenFabricStockBody,
  ReceiveFabricBody,
} from '@admin/warehouse/model';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const openingInput = (body: OpenFabricStockBody): Schemas['OpenFabricStockInput'] => body;
const receiptInput = (body: ReceiveFabricBody): Schemas['ReceiveFabricInput'] => body;
const issueInput = (body: IssueFabricBody): Schemas['IssueFabricInput'] => body;
const adjustmentInput = (body: AdjustFabricStockBody): Schemas['AdjustFabricStockInput'] => body;

/** A stock operation moves balances, the movement list and the «Тканина» tab of items. */
const stockChanged = (_result: unknown, error: unknown) =>
  error
    ? []
    : [
        { type: 'FabricStock' as const },
        { type: 'FabricMovement' as const },
        { type: 'ItemFabric' as const },
      ];

const movementParams = (query: FabricMovementQuery) => ({
  page: query.page,
  kind: query.kind,
  ...(query.fabricCode ? { fabricCode: query.fabricCode } : {}),
  ...(query.color ? { color: query.color } : {}),
  ...(query.itemId ? { itemId: query.itemId } : {}),
});

export const fabricStockApi = warehouseBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getFabricStock: build.query<FabricStockList, void>({
      query: () => '/api/warehouse/fabric-stock',
      transformResponse: mapFabricStockList,
      transformErrorResponse: warehouseApiError,
      providesTags: [{ type: 'FabricStock', id: 'LIST' }],
    }),
    getFabricStockChoices: build.query<FabricStockChoices, void>({
      query: () => '/api/warehouse/fabric-stock/choices',
      transformResponse: mapFabricStockChoices,
      transformErrorResponse: warehouseApiError,
    }),
    getFabricMovements: build.query<FabricMovementPage, FabricMovementQuery>({
      query: (query) => ({
        url: '/api/warehouse/fabric-stock/movements',
        params: movementParams(query),
      }),
      transformResponse: mapFabricMovementPage,
      transformErrorResponse: warehouseApiError,
      providesTags: [{ type: 'FabricMovement', id: 'LIST' }],
    }),
    openFabricStock: build.mutation<FabricStockOperationResult, OpenFabricStockBody>({
      query: (body) => ({
        url: '/api/warehouse/fabric-stock/openings',
        method: 'POST',
        body: openingInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: stockChanged,
    }),
    receiveFabric: build.mutation<FabricStockOperationResult, ReceiveFabricBody>({
      query: (body) => ({
        url: '/api/warehouse/fabric-stock/receipts',
        method: 'POST',
        body: receiptInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: stockChanged,
    }),
    issueFabric: build.mutation<FabricStockOperationResult, IssueFabricBody>({
      query: (body) => ({
        url: '/api/warehouse/fabric-stock/issues',
        method: 'POST',
        body: issueInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: stockChanged,
    }),
    adjustFabricStock: build.mutation<FabricStockOperationResult, AdjustFabricStockBody>({
      query: (body) => ({
        url: '/api/warehouse/fabric-stock/adjustments',
        method: 'POST',
        body: adjustmentInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: stockChanged,
    }),
    reverseFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; reason: string }
    >({
      query: ({ movementId, reason }) => ({
        url: `/api/warehouse/fabric-stock/movements/${movementId}/reverse`,
        method: 'POST',
        body: { reason } satisfies Schemas['ReverseFabricMovementInput'],
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: stockChanged,
    }),
    getFabricConsumption: build.query<FabricConsumption, { from: string; to: string }>({
      query: (params) => ({ url: '/api/warehouse/fabric-stock/consumption', params }),
      transformResponse: mapFabricConsumption,
      transformErrorResponse: warehouseApiError,
      providesTags: [{ type: 'FabricMovement', id: 'CONSUMPTION' }],
    }),
  }),
});

export const {
  useAdjustFabricStockMutation,
  useGetFabricConsumptionQuery,
  useGetFabricMovementsQuery,
  useGetFabricStockChoicesQuery,
  useGetFabricStockQuery,
  useIssueFabricMutation,
  useLazyGetFabricMovementsQuery,
  useOpenFabricStockMutation,
  useReceiveFabricMutation,
  useReverseFabricMovementMutation,
} = fabricStockApi;

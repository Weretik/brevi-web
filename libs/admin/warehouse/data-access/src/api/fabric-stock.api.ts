import { warehouseBaseApi } from './warehouse-base-api';
import { warehouseApiError } from '../errors/warehouse-api-error';
import {
  mapFabricConsumption,
  mapFabricMovementHistory,
  mapFabricMovementPage,
  mapFabricStockChoices,
  mapFabricStockList,
  mapFabricStockOperation,
} from '../mappers/fabric-stock.mapper';

import type { components } from '@admin/shared/contracts';
import type {
  AdjustFabricStockBody,
  EditFabricMovementBody,
  FabricConsumption,
  FabricMovementHistory,
  FabricMovementPage,
  FabricMovementQuery,
  FabricStockChoices,
  FabricStockList,
  FabricStockOperationResult,
  IssueFabricBody,
  OpenFabricStockBody,
  ReceiveFabricBody,
  RestoreFabricMovementBody,
  VoidFabricMovementBody,
} from '@admin/warehouse/model';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const openingInput = (body: OpenFabricStockBody): Schemas['OpenFabricStockInput'] => body;
const receiptInput = (body: ReceiveFabricBody): Schemas['ReceiveFabricInput'] => body;
const issueInput = (body: IssueFabricBody): Schemas['IssueFabricInput'] => body;
const adjustmentInput = (body: AdjustFabricStockBody): Schemas['AdjustFabricStockInput'] => body;
const editInput = (body: EditFabricMovementBody): Schemas['EditFabricMovementInput'] => body;
const voidInput = (body: VoidFabricMovementBody): Schemas['VoidFabricMovementInput'] => body;
const restoreInput = (body: RestoreFabricMovementBody): Schemas['RestoreFabricMovementInput'] =>
  body;

/** A stock operation moves balances, the movement list and the «Тканина» tab of items. */
const stockChanged = (_result: unknown, error: unknown) =>
  error
    ? []
    : [
        { type: 'FabricStock' as const },
        { type: 'FabricMovement' as const },
        { type: 'ItemFabric' as const },
      ];

/** An edit, void or restore also changes the history of that movement. */
const movementRevised = (_result: unknown, error: unknown, arg: { movementId: number }) =>
  error
    ? []
    : [
        ...stockChanged(_result, error),
        { type: 'FabricMovement' as const, id: `HISTORY-${arg.movementId}` },
      ];

const movementParams = (query: FabricMovementQuery) => ({
  page: query.page,
  kind: query.kind,
  ...(query.fabricCode ? { fabricCode: query.fabricCode } : {}),
  ...(query.color ? { color: query.color } : {}),
  ...(query.itemId ? { itemId: query.itemId } : {}),
  ...(query.search.trim() ? { search: query.search.trim() } : {}),
  ...(query.from ? { from: query.from } : {}),
  ...(query.to ? { to: query.to } : {}),
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
    editFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; body: EditFabricMovementBody }
    >({
      query: ({ movementId, body }) => ({
        url: `/api/warehouse/fabric-stock/movements/${movementId}`,
        method: 'PUT',
        body: editInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: movementRevised,
    }),
    voidFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; body: VoidFabricMovementBody }
    >({
      query: ({ movementId, body }) => ({
        url: `/api/warehouse/fabric-stock/movements/${movementId}/void`,
        method: 'POST',
        body: voidInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: movementRevised,
    }),
    restoreFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; body: RestoreFabricMovementBody }
    >({
      query: ({ movementId, body }) => ({
        url: `/api/warehouse/fabric-stock/movements/${movementId}/restore`,
        method: 'POST',
        body: restoreInput(body),
      }),
      transformResponse: mapFabricStockOperation,
      transformErrorResponse: warehouseApiError,
      invalidatesTags: movementRevised,
    }),
    getFabricMovementHistory: build.query<FabricMovementHistory, number>({
      query: (movementId) => `/api/warehouse/fabric-stock/movements/${movementId}/revisions`,
      transformResponse: mapFabricMovementHistory,
      transformErrorResponse: warehouseApiError,
      providesTags: (_result, _error, movementId) => [
        { type: 'FabricMovement', id: `HISTORY-${movementId}` },
      ],
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
  useEditFabricMovementMutation,
  useGetFabricConsumptionQuery,
  useGetFabricMovementHistoryQuery,
  useGetFabricMovementsQuery,
  useGetFabricStockChoicesQuery,
  useGetFabricStockQuery,
  useIssueFabricMutation,
  useLazyGetFabricMovementsQuery,
  useOpenFabricStockMutation,
  useReceiveFabricMutation,
  useRestoreFabricMovementMutation,
  useReverseFabricMovementMutation,
  useVoidFabricMovementMutation,
} = fabricStockApi;

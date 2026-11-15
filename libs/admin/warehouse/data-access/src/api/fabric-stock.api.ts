import { apiCall, apiClient } from '@admin/shared/api-client';

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
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/warehouse/fabric-stock', { signal }),
          mapFabricStockList,
          warehouseApiError,
        ),
      providesTags: [{ type: 'FabricStock', id: 'LIST' }],
    }),
    getFabricStockChoices: build.query<FabricStockChoices, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/warehouse/fabric-stock/choices', { signal }),
          mapFabricStockChoices,
          warehouseApiError,
        ),
    }),
    getFabricMovements: build.query<FabricMovementPage, FabricMovementQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/warehouse/fabric-stock/movements', {
            params: { query: movementParams(query) },
            signal,
          }),
          mapFabricMovementPage,
          warehouseApiError,
        ),
      providesTags: [{ type: 'FabricMovement', id: 'LIST' }],
    }),
    openFabricStock: build.mutation<FabricStockOperationResult, OpenFabricStockBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/openings', {
            body: openingInput(body),
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: stockChanged,
    }),
    receiveFabric: build.mutation<FabricStockOperationResult, ReceiveFabricBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/receipts', {
            body: receiptInput(body),
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: stockChanged,
    }),
    issueFabric: build.mutation<FabricStockOperationResult, IssueFabricBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/issues', { body: issueInput(body), signal }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: stockChanged,
    }),
    adjustFabricStock: build.mutation<FabricStockOperationResult, AdjustFabricStockBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/adjustments', {
            body: adjustmentInput(body),
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: stockChanged,
    }),
    reverseFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; reason: string }
    >({
      queryFn: ({ movementId, reason }, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/movements/{movementId}/reverse', {
            params: { path: { movementId: movementId } },
            body: { reason } satisfies Schemas['ReverseFabricMovementInput'],
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: stockChanged,
    }),
    editFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; body: EditFabricMovementBody }
    >({
      queryFn: ({ movementId, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/warehouse/fabric-stock/movements/{movementId}', {
            params: { path: { movementId: movementId } },
            body: editInput(body),
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: movementRevised,
    }),
    voidFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; body: VoidFabricMovementBody }
    >({
      queryFn: ({ movementId, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/movements/{movementId}/void', {
            params: { path: { movementId: movementId } },
            body: voidInput(body),
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: movementRevised,
    }),
    restoreFabricMovement: build.mutation<
      FabricStockOperationResult,
      { movementId: number; body: RestoreFabricMovementBody }
    >({
      queryFn: ({ movementId, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/warehouse/fabric-stock/movements/{movementId}/restore', {
            params: { path: { movementId: movementId } },
            body: restoreInput(body),
            signal,
          }),
          mapFabricStockOperation,
          warehouseApiError,
        ),
      invalidatesTags: movementRevised,
    }),
    getFabricMovementHistory: build.query<FabricMovementHistory, number>({
      queryFn: (movementId, { signal }) =>
        apiCall(
          apiClient.GET('/api/warehouse/fabric-stock/movements/{movementId}/revisions', {
            params: { path: { movementId: movementId } },
            signal,
          }),
          mapFabricMovementHistory,
          warehouseApiError,
        ),
      providesTags: (_result, _error, movementId) => [
        { type: 'FabricMovement', id: `HISTORY-${movementId}` },
      ],
    }),
    getFabricConsumption: build.query<FabricConsumption, { from: string; to: string }>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/warehouse/fabric-stock/consumption', {
            params: { query: params },
            signal,
          }),
          mapFabricConsumption,
          warehouseApiError,
        ),
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

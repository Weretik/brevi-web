import { apiCall, apiClient } from '@admin/shared/api-client';

import { stockChanged } from './fabric-stock.api';
import { warehouseBaseApi } from './warehouse-base-api';
import { warehouseApiError } from '../errors/warehouse-api-error';
import { mapFabricMovementHistory } from '../mappers/fabric-movement.mapper';
import { mapFabricStockOperation } from '../mappers/fabric-stock.mapper';

import type { components } from '@admin/shared/contracts';
import type {
  EditFabricMovementBody,
  FabricMovementHistory,
  FabricStockOperationResult,
  RestoreFabricMovementBody,
  VoidFabricMovementBody,
} from '@admin/warehouse/model';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const editInput = (body: EditFabricMovementBody): Schemas['EditFabricMovementInput'] => body;
const voidInput = (body: VoidFabricMovementBody): Schemas['VoidFabricMovementInput'] => body;
const restoreInput = (body: RestoreFabricMovementBody): Schemas['RestoreFabricMovementInput'] =>
  body;

/** An edit, void or restore also changes the history of that movement. */
const movementRevised = (_result: unknown, error: unknown, arg: { movementId: number }) =>
  error
    ? []
    : [
        ...stockChanged(_result, error),
        { type: 'FabricMovement' as const, id: `HISTORY-${arg.movementId}` },
      ];

/** Corrections of a saved fabric movement: reverse, edit, void, restore and its revision history. */
export const fabricMovementRevisionsApi = warehouseBaseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const {
  useEditFabricMovementMutation,
  useGetFabricMovementHistoryQuery,
  useRestoreFabricMovementMutation,
  useReverseFabricMovementMutation,
  useVoidFabricMovementMutation,
} = fabricMovementRevisionsApi;

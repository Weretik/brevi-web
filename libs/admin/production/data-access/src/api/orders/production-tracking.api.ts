import { apiCall, apiClient } from '@admin/shared/api-client';

import { productionOrderErrors, toProductionApiError } from '../../errors/production-api-error';
import { mapProductionOrder } from '../../mappers/orders/card/production-order.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  CreateProductionShipmentBody,
  ProductionFileKind,
  ProductionOrder,
  ProductionStage,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const shipmentInput = (
  body: CreateProductionShipmentBody,
): Schemas['CreateProductionShipmentInput'] => body;
const errors = (response: unknown) => toProductionApiError(response, productionOrderErrors);
const list = { type: 'ProductionOrder' as const, id: 'LIST' };
const one = (id: number) => ({ type: 'ProductionOrder' as const, id });

/** Every change returns the whole card; the list shows stages and status, so it is refreshed too. */
const changed = (_result: unknown, error: unknown, { id }: { id: number }) =>
  error ? [] : [list, one(id)];

export interface UploadProductionFileArgs {
  id: number;
  itemId: number | null;
  kind: ProductionFileKind;
  file: File;
}

export const productionTrackingApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    setProductionItemStages: build.mutation<
      ProductionOrder,
      { id: number; itemId: number; version: number; stages: ProductionStage[] }
    >({
      queryFn: ({ id, itemId, version, stages }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/orders/{id}/items/{itemId}/stages', {
            params: { path: { id: id, itemId: itemId } },
            body: { version, stages } satisfies Schemas['SetProductionItemStagesInput'],
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: changed,
    }),
    createProductionShipment: build.mutation<
      ProductionOrder,
      { id: number; itemId: number; body: CreateProductionShipmentBody }
    >({
      queryFn: ({ id, itemId, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/{id}/items/{itemId}/shipments', {
            params: { path: { id: id, itemId: itemId } },
            body: shipmentInput(body),
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: changed,
    }),
    cancelProductionShipment: build.mutation<
      ProductionOrder,
      { id: number; shipmentId: number; version: number }
    >({
      queryFn: ({ id, shipmentId, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/production/orders/{id}/shipments/{shipmentId}', {
            params: { path: { id: id, shipmentId: shipmentId }, query: { version } },
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: changed,
    }),
    changeProductionOrderStatus: build.mutation<
      ProductionOrder,
      { id: number; version: number } & (
        { action: 'close' | 'reopen' } | { action: 'cancel'; reason: string }
      )
    >({
      queryFn: (args, { signal }) => {
        const path = { id: args.id };
        const version = { version: args.version } satisfies Schemas['ProductionOrderVersionInput'];
        const request =
          args.action === 'cancel'
            ? apiClient.POST('/api/production/orders/{id}/cancel', {
                params: { path },
                body: {
                  ...version,
                  reason: args.reason,
                } satisfies Schemas['CancelProductionOrderInput'],
                signal,
              })
            : args.action === 'close'
              ? apiClient.POST('/api/production/orders/{id}/close', {
                  params: { path },
                  body: version,
                  signal,
                })
              : apiClient.POST('/api/production/orders/{id}/reopen', {
                  params: { path },
                  body: version,
                  signal,
                });
        return apiCall(request, mapProductionOrder, errors);
      },
      invalidatesTags: changed,
    }),
  }),
});

export const {
  useCancelProductionShipmentMutation,
  useChangeProductionOrderStatusMutation,
  useCreateProductionShipmentMutation,
  useSetProductionItemStagesMutation,
} = productionTrackingApi;

import { productionBaseApi } from './production-base-api';
import { productionOrderErrors, toProductionApiError } from '../errors/production-api-error';
import { mapProductionOrder } from '../mappers/production-order.mapper';
import { mapProgressImportResult } from '../mappers/production-tracking.mapper';

import type {
  CreateProductionShipmentBody,
  ProductionFileKind,
  ProductionImportResult,
  ProductionOrder,
  ProductionProgressImportRow,
  ProductionStage,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const shipmentInput = (
  body: CreateProductionShipmentBody,
): Schemas['CreateProductionShipmentInput'] => body;
const progressInput = (
  rows: ProductionProgressImportRow[],
): Schemas['ProductionProgressImportRow'][] => rows;

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
      query: ({ id, itemId, version, stages }) => ({
        url: `/api/production/orders/${id}/items/${itemId}/stages`,
        method: 'PUT',
        body: { version, stages } satisfies Schemas['SetProductionItemStagesInput'],
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    createProductionShipment: build.mutation<
      ProductionOrder,
      { id: number; itemId: number; body: CreateProductionShipmentBody }
    >({
      query: ({ id, itemId, body }) => ({
        url: `/api/production/orders/${id}/items/${itemId}/shipments`,
        method: 'POST',
        body: shipmentInput(body),
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    cancelProductionShipment: build.mutation<
      ProductionOrder,
      { id: number; shipmentId: number; version: number }
    >({
      query: ({ id, shipmentId, version }) => ({
        url: `/api/production/orders/${id}/shipments/${shipmentId}`,
        method: 'DELETE',
        params: { version },
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    changeProductionOrderStatus: build.mutation<
      ProductionOrder,
      { id: number; version: number } & (
        { action: 'close' | 'reopen' } | { action: 'cancel'; reason: string }
      )
    >({
      query: (args) => ({
        url: `/api/production/orders/${args.id}/${args.action}`,
        method: 'POST',
        body:
          args.action === 'cancel'
            ? ({
                version: args.version,
                reason: args.reason,
              } satisfies Schemas['CancelProductionOrderInput'])
            : ({ version: args.version } satisfies Schemas['ProductionOrderVersionInput']),
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    uploadProductionOrderFile: build.mutation<ProductionOrder, UploadProductionFileArgs>({
      query: ({ id, itemId, kind, file }) => {
        const body = new FormData();
        body.append('file', file);
        body.append('kind', kind);
        if (itemId !== null) body.append('itemId', String(itemId));
        return { url: `/api/production/orders/${id}/files`, method: 'POST', body };
      },
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    deleteProductionOrderFile: build.mutation<ProductionOrder, { id: number; fileId: number }>({
      query: ({ id, fileId }) => ({
        url: `/api/production/orders/${id}/files/${fileId}`,
        method: 'DELETE',
      }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    sendProductionOrderTelegram: build.mutation<ProductionOrder, { id: number }>({
      query: ({ id }) => ({ url: `/api/production/orders/${id}/telegram`, method: 'POST' }),
      transformResponse: mapProductionOrder,
      transformErrorResponse: errors,
      invalidatesTags: changed,
    }),
    importProductionProgress: build.mutation<
      ProductionImportResult,
      { rows: ProductionProgressImportRow[]; dryRun: boolean }
    >({
      query: ({ rows, dryRun }) => ({
        url: '/api/production/orders/progress-import',
        method: 'POST',
        params: { dryRun },
        body: progressInput(rows),
      }),
      transformResponse: mapProgressImportResult,
      transformErrorResponse: errors,
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : [{ type: 'ProductionOrder' }],
    }),
  }),
});

export const {
  useCancelProductionShipmentMutation,
  useChangeProductionOrderStatusMutation,
  useCreateProductionShipmentMutation,
  useDeleteProductionOrderFileMutation,
  useImportProductionProgressMutation,
  useSendProductionOrderTelegramMutation,
  useSetProductionItemStagesMutation,
  useUploadProductionOrderFileMutation,
} = productionTrackingApi;

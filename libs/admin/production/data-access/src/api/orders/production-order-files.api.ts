import { apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import { productionOrderErrors, toProductionApiError } from '../../errors/production-api-error';
import { mapProductionOrder } from '../../mappers/orders/production-order.mapper';
import {
  mapProgressImportResult,
  mapReportPriceImportResult,
} from '../../mappers/orders/production-tracking.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  ProductionFileKind,
  ProductionImportResult,
  ProductionOrder,
  ProductionProgressImportRow,
  ProductionReportPriceImportRow,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const progressInput = (
  rows: ProductionProgressImportRow[],
): Schemas['ProductionProgressImportRow'][] => rows;

const reportPriceInput = (
  rows: ProductionReportPriceImportRow[],
): Schemas['ProductionReportPriceImportRow'][] => rows;

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

/** Order files, the Telegram send and the imports of progress and report prices. */
export const productionOrderFilesApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadProductionOrderFile: build.mutation<ProductionOrder, UploadProductionFileArgs>({
      queryFn: ({ id, itemId, kind, file }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/{id}/files', {
            params: { path: { id } },
            ...formDataBody({ file, kind, itemId }),
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: changed,
    }),
    deleteProductionOrderFile: build.mutation<ProductionOrder, { id: number; fileId: number }>({
      queryFn: ({ id, fileId }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/production/orders/{id}/files/{fileId}', {
            params: { path: { id: id, fileId: fileId } },
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: changed,
    }),
    sendProductionOrderTelegram: build.mutation<ProductionOrder, { id: number }>({
      queryFn: ({ id }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/{id}/telegram', {
            params: { path: { id: id } },
            signal,
          }),
          mapProductionOrder,
          errors,
        ),
      invalidatesTags: changed,
    }),
    importProductionProgress: build.mutation<
      ProductionImportResult,
      { rows: ProductionProgressImportRow[]; dryRun: boolean }
    >({
      queryFn: ({ rows, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/progress-import', {
            params: { query: { dryRun } },
            body: progressInput(rows),
            signal,
          }),
          mapProgressImportResult,
          errors,
        ),
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : [{ type: 'ProductionOrder' }],
    }),
    importProductionReportPrices: build.mutation<
      ProductionImportResult,
      { rows: ProductionReportPriceImportRow[]; dryRun: boolean }
    >({
      queryFn: ({ rows, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/report-price-import', {
            params: { query: { dryRun } },
            body: reportPriceInput(rows),
            signal,
          }),
          mapReportPriceImportResult,
          errors,
        ),
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : [{ type: 'ProductionOrder' }],
    }),
  }),
});

export const {
  useDeleteProductionOrderFileMutation,
  useImportProductionProgressMutation,
  useImportProductionReportPricesMutation,
  useSendProductionOrderTelegramMutation,
  useUploadProductionOrderFileMutation,
} = productionOrderFilesApi;

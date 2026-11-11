import { warehouseBaseApi } from './warehouse-base-api';
import { warehouseApiError } from '../errors/warehouse-api-error';
import { mapStockTransferResult } from '../mappers/stock-transfer.mapper';

import type { components } from '@admin/shared/contracts';
import type { StockTransferInput, StockTransferResult } from '@admin/warehouse/model';

type Schemas = components['schemas'];

export interface StockTransferArgs {
  input: StockTransferInput;
  dryRun: boolean;
  confirmReplace: boolean;
}

/** The rows keep the export's columns as they are; the server checks every value. */
const transferInput = (input: StockTransferInput) =>
  input as unknown as Schemas['StockTransferInput'];

export const stockTransferApi = warehouseBaseApi.injectEndpoints({
  endpoints: (build) => ({
    transferFabricStock: build.mutation<StockTransferResult, StockTransferArgs>({
      query: ({ input, dryRun, confirmReplace }) => ({
        url: '/api/warehouse/fabric-stock/transfer',
        method: 'POST',
        params: { dryRun, confirmReplace },
        body: transferInput(input),
      }),
      transformResponse: mapStockTransferResult,
      transformErrorResponse: warehouseApiError,
      /** An applied transfer replaces the whole stock, its movements and the items' fabric. */
      invalidatesTags: (result) =>
        result?.applied ? ['FabricStock', 'FabricMovement', 'ItemFabric', 'ProductionOrder'] : [],
    }),
  }),
});

export const { useTransferFabricStockMutation } = stockTransferApi;

import {
  adminApi,
  apiCall,
  apiClient,
  formDataBody,
  toAdminApiError,
} from '@admin/shared/api-client';

import { compressPriceFile } from './compress-price-file';
import { productPricesTag } from '../../cache/product-prices-tag';
import { referenceErrorMessages } from '../../errors/reference-error-messages';
import {
  mapPriceImportResult,
  mapPriceSources,
} from '../../mappers/price-import/price-import.mapper';
import {
  parsePriceImportResponse,
  parsePriceSourcesResponse,
} from '../../validators/price-import/price-import-response';

import type { UpdatePriceSourceBody } from '../../contracts/price-import/price-import-response';
import type { PriceImportResult, PriceSourceList } from '@admin/references/model';

const tag = 'PriceSource' as const;
const priceImportErrors = {
  ...referenceErrorMessages,
  unauthorized: 'Немає доступу. Знижки змінюють адміністратор і директор.',
  notFound: 'Постачальника не знайдено. Оновіть сторінку.',
};

export interface ImportPriceFilesRequest {
  key: string;
  files: File[];
  /** True shows what changes; false saves the changed prices. */
  dryRun: boolean;
}

export interface RefreshPriceSourceRequest {
  key: string;
  /** True shows what changes; false reads the supplier again and saves the changed prices. */
  dryRun: boolean;
}

export const priceImportApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listPriceSources: build.query<PriceSourceList, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/pricing/ppe/supplier-prices', { signal }),
          (value: unknown) => mapPriceSources(parsePriceSourcesResponse(value)),
          (error) => toAdminApiError(error, priceImportErrors),
        ),
      providesTags: [{ type: tag, id: 'LIST' }],
    }),
    updatePriceSource: build.mutation<void, { key: string; body: UpdatePriceSourceBody }>({
      queryFn: ({ key, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/v1/pricing/ppe/supplier-prices/{key}', {
            params: { path: { key: key } },
            body: body,
            signal,
          }),
          undefined,
          (error) => toAdminApiError(error, priceImportErrors),
        ),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    importPriceFiles: build.mutation<PriceImportResult, ImportPriceFilesRequest>({
      queryFn: async ({ key, files, dryRun }, { signal }) => {
        // The file keeps its name; the server sees from the bytes that it is compressed.
        const compressed = await Promise.all(
          files.map(async (file) => new File([await compressPriceFile(file)], file.name)),
        );
        return apiCall(
          apiClient.POST('/api/v1/pricing/ppe/supplier-prices/{key}/import', {
            params: { path: { key }, query: { dryRun } },
            ...formDataBody({ files: compressed }),
            signal,
          }),
          (value: unknown) => mapPriceImportResult(parsePriceImportResponse(value)),
          (error) => toAdminApiError(error, priceImportErrors),
        );
      },
      invalidatesTags: (result, error) =>
        error || !result?.applied ? [] : [productPricesTag, { type: tag, id: 'LIST' }],
    }),
    refreshPriceSource: build.mutation<PriceImportResult, RefreshPriceSourceRequest>({
      queryFn: ({ key, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/v1/pricing/ppe/supplier-prices/{key}/refresh', {
            params: { path: { key: key }, query: { dryRun } },
            signal,
          }),
          (value: unknown) => mapPriceImportResult(parsePriceImportResponse(value)),
          (error) => toAdminApiError(error, priceImportErrors),
        ),
      invalidatesTags: (result, error) =>
        error || !result?.applied ? [] : [productPricesTag, { type: tag, id: 'LIST' }],
    }),
  }),
});

export const {
  useImportPriceFilesMutation,
  useListPriceSourcesQuery,
  useRefreshPriceSourceMutation,
  useUpdatePriceSourceMutation,
} = priceImportApi;

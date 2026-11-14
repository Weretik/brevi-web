import { adminApi, toAdminApiError } from '@admin/shared/api-client';

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
const base = '/api/v1/pricing/ppe/supplier-prices';

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
      query: () => base,
      transformResponse: (value: unknown) => mapPriceSources(parsePriceSourcesResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, priceImportErrors),
      providesTags: [{ type: tag, id: 'LIST' }],
    }),
    updatePriceSource: build.mutation<void, { key: string; body: UpdatePriceSourceBody }>({
      query: ({ key, body }) => ({
        url: `${base}/${encodeURIComponent(key)}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, priceImportErrors),
      invalidatesTags: (_result, error) => (error ? [] : [{ type: tag, id: 'LIST' }]),
    }),
    importPriceFiles: build.mutation<PriceImportResult, ImportPriceFilesRequest>({
      queryFn: async ({ key, files, dryRun }, _api, _extra, baseQuery) => {
        const body = new FormData();
        for (const file of files) body.append('files', await compressPriceFile(file), file.name);
        const result = await baseQuery({
          url: `${base}/${encodeURIComponent(key)}/import`,
          method: 'POST',
          params: { dryRun },
          body,
        });
        if (result.error) return { error: toAdminApiError(result.error, priceImportErrors) };
        try {
          return { data: mapPriceImportResult(parsePriceImportResponse(result.data)) };
        } catch (error) {
          return { error: toAdminApiError(error, priceImportErrors) };
        }
      },
      invalidatesTags: (result, error) =>
        error || !result?.applied ? [] : [productPricesTag, { type: tag, id: 'LIST' }],
    }),
    refreshPriceSource: build.mutation<PriceImportResult, RefreshPriceSourceRequest>({
      query: ({ key, dryRun }) => ({
        url: `${base}/${encodeURIComponent(key)}/refresh`,
        method: 'POST',
        params: { dryRun },
      }),
      transformResponse: (value: unknown) => mapPriceImportResult(parsePriceImportResponse(value)),
      transformErrorResponse: (error) => toAdminApiError(error, priceImportErrors),
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

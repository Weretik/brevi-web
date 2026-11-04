import { productionBaseApi } from './production-base-api';
import { fabricNormErrors, toProductionApiError } from '../errors/production-api-error';
import { mapFabricNormRow, mapFabricNormRows } from '../mappers/fabric-norm.mapper';
import { mapFabricNormImportResult } from '../mappers/production-import.mapper';

import type {
  FabricNormImportRow,
  FabricNormRow,
  FabricNormValues,
  ProductionImportResult,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type NormInput = components['schemas']['FabricNormInput'];

const toInput = (norm: FabricNormValues): NormInput => ({ ...norm });

const normList = [{ type: 'FabricNorm' as const, id: 'LIST' }];
const errors = (response: unknown) => toProductionApiError(response, fabricNormErrors);

export const fabricNormsApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getFabricNorms: build.query<FabricNormRow[], void>({
      query: () => '/api/production/fabric-norms',
      transformResponse: mapFabricNormRows,
      transformErrorResponse: errors,
      providesTags: normList,
    }),
    saveFabricNorm: build.mutation<FabricNormRow, { modelCode: string; norm: FabricNormValues }>({
      query: ({ modelCode, norm }) => ({
        url: `/api/production/fabric-norms/${encodeURIComponent(modelCode)}`,
        method: 'PUT',
        body: toInput(norm),
      }),
      transformResponse: mapFabricNormRow,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : normList),
    }),
    deleteFabricNorm: build.mutation<void, string>({
      query: (modelCode) => ({
        url: `/api/production/fabric-norms/${encodeURIComponent(modelCode)}`,
        method: 'DELETE',
      }),
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : normList),
    }),
    importFabricNorms: build.mutation<
      ProductionImportResult,
      { rows: FabricNormImportRow[]; dryRun: boolean }
    >({
      query: ({ rows, dryRun }) => ({
        url: '/api/production/fabric-norms/import',
        method: 'POST',
        params: { dryRun },
        body: rows.map((row) => ({ modelCode: row.modelCode, norm: toInput(row.norm) })),
      }),
      transformResponse: mapFabricNormImportResult,
      transformErrorResponse: errors,
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : normList,
    }),
  }),
});

export const {
  useDeleteFabricNormMutation,
  useGetFabricNormsQuery,
  useImportFabricNormsMutation,
  useSaveFabricNormMutation,
} = fabricNormsApi;

import { apiCall, apiClient } from '@admin/shared/api-client';

import { fabricNormErrors, toProductionApiError } from '../../errors/production-api-error';
import { mapFabricNormRow, mapFabricNormRows } from '../../mappers/norms/fabric-norm.mapper';
import { mapModelCompositions } from '../../mappers/norms/model-composition.mapper';
import { mapFabricNormImportResult } from '../../mappers/orders/sources/production-import.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  FabricNormImportRow,
  FabricNormRow,
  FabricNormValues,
  ModelComposition,
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
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/fabric-norms', { signal }),
          mapFabricNormRows,
          errors,
        ),
      providesTags: normList,
    }),
    /** Read from «Товари»; changes there show after a reload of the tab. */
    getModelCompositions: build.query<ModelComposition[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/fabric-norms/compositions', { signal }),
          mapModelCompositions,
          errors,
        ),
    }),
    saveFabricNorm: build.mutation<FabricNormRow, { modelCode: string; norm: FabricNormValues }>({
      queryFn: ({ modelCode, norm }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/fabric-norms/{modelCode}', {
            params: { path: { modelCode: modelCode } },
            body: toInput(norm),
            signal,
          }),
          mapFabricNormRow,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : normList),
    }),
    deleteFabricNorm: build.mutation<void, string>({
      queryFn: (modelCode, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/production/fabric-norms/{modelCode}', {
            params: { path: { modelCode: modelCode } },
            signal,
          }),
          undefined,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : normList),
    }),
    importFabricNorms: build.mutation<
      ProductionImportResult,
      { rows: FabricNormImportRow[]; dryRun: boolean }
    >({
      queryFn: ({ rows, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/fabric-norms/import', {
            params: { query: { dryRun } },
            body: rows.map((row) => ({ modelCode: row.modelCode, norm: toInput(row.norm) })),
            signal,
          }),
          mapFabricNormImportResult,
          errors,
        ),
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : normList,
    }),
  }),
});

export const {
  useDeleteFabricNormMutation,
  useGetFabricNormsQuery,
  useGetModelCompositionsQuery,
  useImportFabricNormsMutation,
  useSaveFabricNormMutation,
} = fabricNormsApi;

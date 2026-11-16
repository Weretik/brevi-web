import { apiCall, apiClient } from '@admin/shared/api-client';

import { embroideryBaseApi } from './embroidery-base-api';
import { toEmbroideryApiError } from '../errors/embroidery-api-error';
import {
  mapEmbroiderySavedCalculation,
  mapEmbroiderySavedPage,
  toSaveEmbroideryCalculationInput,
} from '../mappers/embroidery-saved.mapper';
import {
  mapEmbroideryCalculation,
  mapEmbroideryForm,
  mapEmbroiderySettings,
  toCalculateEmbroideryInput,
  toSaveEmbroiderySettingsInput,
} from '../mappers/embroidery.mapper';
import {
  ensureEmbroideryCalculation,
  ensureEmbroideryForm,
  ensureEmbroiderySavedCalculation,
  ensureEmbroiderySavedPage,
  ensureEmbroiderySettings,
} from '../validators/embroidery-response';

import type {
  EmbroideryCalculation,
  EmbroideryCalculationRequest,
  EmbroideryFormSetup,
  EmbroiderySavedCalculation,
  EmbroiderySavedPage,
  EmbroiderySaveRequest,
  EmbroiderySettings,
  EmbroiderySettingsContent,
} from '@admin/embroidery/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const settingsTag = [{ type: 'EmbroiderySettings' as const, id: 'CURRENT' }];
const savedListTag = { type: 'EmbroideryCalculations' as const, id: 'LIST' };

export interface EmbroiderySavedListArgs {
  search: string;
  page: number;
  pageSize: number;
}

export const embroideryApi = embroideryBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getEmbroideryForm: build.query<EmbroideryFormSetup, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/embroidery/form', { signal }),
          (value: unknown) => mapEmbroideryForm(ensureEmbroideryForm(value)),
          toEmbroideryApiError,
        ),
      providesTags: settingsTag,
    }),
    /** A POST that changes nothing: a query, so the same inputs come from the cache. */
    calculateEmbroidery: build.query<EmbroideryCalculation, EmbroideryCalculationRequest>({
      queryFn: (request, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/embroidery/calculate', {
            body: toCalculateEmbroideryInput(request),
            signal,
          }),
          (value: unknown) => mapEmbroideryCalculation(ensureEmbroideryCalculation(value)),
          toEmbroideryApiError,
        ),
      providesTags: settingsTag,
      keepUnusedDataFor: 30,
    }),
    getEmbroiderySettings: build.query<EmbroiderySettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/embroidery/settings', { signal }),
          (value: unknown) => mapEmbroiderySettings(ensureEmbroiderySettings(value)),
          toEmbroideryApiError,
        ),
      providesTags: settingsTag,
    }),
    saveEmbroiderySettings: build.mutation<
      EmbroiderySettings,
      { version: number; settings: EmbroiderySettingsContent }
    >({
      queryFn: ({ version, settings }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/embroidery/settings', {
            body: toSaveEmbroiderySettingsInput(version, settings),
            signal,
          }),
          (value: unknown) => mapEmbroiderySettings(ensureEmbroiderySettings(value)),
          toEmbroideryApiError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : settingsTag),
    }),
    getEmbroideryCalculations: build.query<EmbroiderySavedPage, EmbroiderySavedListArgs>({
      queryFn: ({ search, page, pageSize }, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/embroidery/calculations', {
            params: {
              query: { ...(search.trim() ? { search: search.trim() } : {}), page, pageSize },
            },
            signal,
          }),
          (value: unknown) => mapEmbroiderySavedPage(ensureEmbroiderySavedPage(value)),
          toEmbroideryApiError,
        ),
      providesTags: [savedListTag],
    }),
    getEmbroideryCalculation: build.query<EmbroiderySavedCalculation, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/embroidery/calculations/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          (value: unknown) =>
            mapEmbroiderySavedCalculation(ensureEmbroiderySavedCalculation(value)),
          toEmbroideryApiError,
        ),
      providesTags: (_result, _error, id) => [{ type: 'EmbroideryCalculations', id }],
    }),
    saveEmbroideryCalculation: build.mutation<EmbroiderySavedCalculation, EmbroiderySaveRequest>({
      queryFn: (request, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/embroidery/calculations', {
            body: toSaveEmbroideryCalculationInput(request),
            signal,
          }),
          (value: unknown) =>
            mapEmbroiderySavedCalculation(ensureEmbroiderySavedCalculation(value)),
          toEmbroideryApiError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [savedListTag]),
    }),
    setEmbroideryMockup: build.mutation<
      EmbroiderySavedCalculation,
      { id: number; mediaFileId: number | null }
    >({
      queryFn: ({ id, mediaFileId }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/embroidery/calculations/{id}/mockup', {
            params: { path: { id: id } },
            body: { mediaFileId } satisfies Schemas['SetEmbroideryMockupInput'],
            signal,
          }),
          (value: unknown) =>
            mapEmbroiderySavedCalculation(ensureEmbroiderySavedCalculation(value)),
          toEmbroideryApiError,
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [savedListTag, { type: 'EmbroideryCalculations', id }],
    }),
    deleteEmbroideryCalculation: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/crm/embroidery/calculations/{id}', {
            params: { path: { id: id } },
            signal,
          }),
          undefined,
          toEmbroideryApiError,
        ),
      invalidatesTags: (_result, error, id) =>
        error ? [] : [savedListTag, { type: 'EmbroideryCalculations', id }],
    }),
  }),
});

export const {
  useCalculateEmbroideryQuery,
  useDeleteEmbroideryCalculationMutation,
  useGetEmbroideryCalculationQuery,
  useGetEmbroideryCalculationsQuery,
  useSaveEmbroideryCalculationMutation,
  useGetEmbroideryFormQuery,
  useGetEmbroiderySettingsQuery,
  useSaveEmbroiderySettingsMutation,
  useSetEmbroideryMockupMutation,
} = embroideryApi;

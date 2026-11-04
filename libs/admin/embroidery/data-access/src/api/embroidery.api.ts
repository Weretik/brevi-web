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
      query: () => '/api/crm/embroidery/form',
      transformResponse: (value: unknown) => mapEmbroideryForm(ensureEmbroideryForm(value)),
      transformErrorResponse: toEmbroideryApiError,
      providesTags: settingsTag,
    }),
    /** A POST that changes nothing: a query, so the same inputs come from the cache. */
    calculateEmbroidery: build.query<EmbroideryCalculation, EmbroideryCalculationRequest>({
      query: (request) => ({
        url: '/api/crm/embroidery/calculate',
        method: 'POST',
        body: toCalculateEmbroideryInput(request),
      }),
      transformResponse: (value: unknown) =>
        mapEmbroideryCalculation(ensureEmbroideryCalculation(value)),
      transformErrorResponse: toEmbroideryApiError,
      providesTags: settingsTag,
      keepUnusedDataFor: 30,
    }),
    getEmbroiderySettings: build.query<EmbroiderySettings, void>({
      query: () => '/api/crm/embroidery/settings',
      transformResponse: (value: unknown) => mapEmbroiderySettings(ensureEmbroiderySettings(value)),
      transformErrorResponse: toEmbroideryApiError,
      providesTags: settingsTag,
    }),
    saveEmbroiderySettings: build.mutation<
      EmbroiderySettings,
      { version: number; settings: EmbroiderySettingsContent }
    >({
      query: ({ version, settings }) => ({
        url: '/api/crm/embroidery/settings',
        method: 'PUT',
        body: toSaveEmbroiderySettingsInput(version, settings),
      }),
      transformResponse: (value: unknown) => mapEmbroiderySettings(ensureEmbroiderySettings(value)),
      transformErrorResponse: toEmbroideryApiError,
      invalidatesTags: (_result, error) => (error ? [] : settingsTag),
    }),
    getEmbroideryCalculations: build.query<EmbroiderySavedPage, EmbroiderySavedListArgs>({
      query: ({ search, page, pageSize }) => ({
        url: '/api/crm/embroidery/calculations',
        params: { ...(search.trim() ? { search: search.trim() } : {}), page, pageSize },
      }),
      transformResponse: (value: unknown) =>
        mapEmbroiderySavedPage(ensureEmbroiderySavedPage(value)),
      transformErrorResponse: toEmbroideryApiError,
      providesTags: [savedListTag],
    }),
    getEmbroideryCalculation: build.query<EmbroiderySavedCalculation, number>({
      query: (id) => `/api/crm/embroidery/calculations/${id}`,
      transformResponse: (value: unknown) =>
        mapEmbroiderySavedCalculation(ensureEmbroiderySavedCalculation(value)),
      transformErrorResponse: toEmbroideryApiError,
      providesTags: (_result, _error, id) => [{ type: 'EmbroideryCalculations', id }],
    }),
    saveEmbroideryCalculation: build.mutation<EmbroiderySavedCalculation, EmbroiderySaveRequest>({
      query: (request) => ({
        url: '/api/crm/embroidery/calculations',
        method: 'POST',
        body: toSaveEmbroideryCalculationInput(request),
      }),
      transformResponse: (value: unknown) =>
        mapEmbroiderySavedCalculation(ensureEmbroiderySavedCalculation(value)),
      transformErrorResponse: toEmbroideryApiError,
      invalidatesTags: (_result, error) => (error ? [] : [savedListTag]),
    }),
    deleteEmbroideryCalculation: build.mutation<void, number>({
      query: (id) => ({ url: `/api/crm/embroidery/calculations/${id}`, method: 'DELETE' }),
      transformErrorResponse: toEmbroideryApiError,
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
} = embroideryApi;

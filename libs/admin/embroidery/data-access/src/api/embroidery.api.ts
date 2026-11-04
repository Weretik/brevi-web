import { embroideryBaseApi } from './embroidery-base-api';
import { toEmbroideryApiError } from '../errors/embroidery-api-error';
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
  ensureEmbroiderySettings,
} from '../validators/embroidery-response';

import type {
  EmbroideryCalculation,
  EmbroideryCalculationRequest,
  EmbroideryFormSetup,
  EmbroiderySettings,
  EmbroiderySettingsContent,
} from '@admin/embroidery/model';

const settingsTag = [{ type: 'EmbroiderySettings' as const, id: 'CURRENT' }];

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
  }),
});

export const {
  useCalculateEmbroideryQuery,
  useGetEmbroideryFormQuery,
  useGetEmbroiderySettingsQuery,
  useSaveEmbroiderySettingsMutation,
} = embroideryApi;

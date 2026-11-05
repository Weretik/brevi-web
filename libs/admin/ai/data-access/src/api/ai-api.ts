import { adminApi } from '@admin/shared/api-client';

import { aiApiError } from '../errors/ai-api-error';
import { mapAiSettings, mapAiTestResult } from '../mappers/ai-settings.mapper';

import type { AiModelTier, AiSettings, AiSettingsInput, AiTestResult } from '@admin/ai/model';

const aiSettingsTag = { type: 'AiSettings' as const, id: 'CURRENT' };

const aiBaseApi = adminApi.enhanceEndpoints({ addTagTypes: ['AiSettings'] });

/** «Налаштування ШІ»: every write returns the whole settings, which replace the cached ones. */
export const aiApi = aiBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getAiSettings: build.query<AiSettings, void>({
      query: () => ({ url: '/api/ai/settings' }),
      transformResponse: mapAiSettings,
      transformErrorResponse: aiApiError,
      providesTags: [aiSettingsTag],
    }),
    updateAiSettings: build.mutation<AiSettings, AiSettingsInput>({
      query: (body) => ({ url: '/api/ai/settings', method: 'PUT', body }),
      transformResponse: mapAiSettings,
      transformErrorResponse: aiApiError,
      invalidatesTags: [aiSettingsTag],
    }),
    setAiKey: build.mutation<AiSettings, string>({
      query: (apiKey) => ({ url: '/api/ai/settings/key', method: 'PUT', body: { apiKey } }),
      transformResponse: mapAiSettings,
      transformErrorResponse: aiApiError,
      invalidatesTags: [aiSettingsTag],
    }),
    removeAiKey: build.mutation<AiSettings, void>({
      query: () => ({ url: '/api/ai/settings/key', method: 'DELETE' }),
      transformResponse: mapAiSettings,
      transformErrorResponse: aiApiError,
      invalidatesTags: [aiSettingsTag],
    }),
    updateAiPrompt: build.mutation<AiSettings, { key: string; text: string }>({
      query: ({ key, text }) => ({
        url: `/api/ai/settings/prompts/${encodeURIComponent(key)}`,
        method: 'PUT',
        body: { text },
      }),
      transformResponse: mapAiSettings,
      transformErrorResponse: aiApiError,
      invalidatesTags: [aiSettingsTag],
    }),
    testAiConnection: build.mutation<AiTestResult, AiModelTier>({
      query: (tier) => ({ url: '/api/ai/settings/test', method: 'POST', body: { tier } }),
      transformResponse: mapAiTestResult,
      transformErrorResponse: aiApiError,
      // The test is counted in this month's use.
      invalidatesTags: [aiSettingsTag],
    }),
  }),
});

export const {
  useGetAiSettingsQuery,
  useRemoveAiKeyMutation,
  useSetAiKeyMutation,
  useTestAiConnectionMutation,
  useUpdateAiPromptMutation,
  useUpdateAiSettingsMutation,
} = aiApi;

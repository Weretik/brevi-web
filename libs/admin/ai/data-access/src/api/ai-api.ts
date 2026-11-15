import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { aiApiError } from '../errors/ai-api-error';
import { mapAiSettings, mapAiTestResult } from '../mappers/ai-settings.mapper';

import type { AiModelTier, AiSettings, AiSettingsInput, AiTestResult } from '@admin/ai/model';

const aiSettingsTag = { type: 'AiSettings' as const, id: 'CURRENT' };

const aiBaseApi = adminApi.enhanceEndpoints({ addTagTypes: ['AiSettings'] });

/** «Налаштування ШІ»: every write returns the whole settings, which replace the cached ones. */
export const aiApi = aiBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getAiSettings: build.query<AiSettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/ai/settings', { signal }), mapAiSettings, aiApiError),
      providesTags: [aiSettingsTag],
    }),
    updateAiSettings: build.mutation<AiSettings, AiSettingsInput>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.PUT('/api/ai/settings', { body: body, signal }),
          mapAiSettings,
          aiApiError,
        ),
      invalidatesTags: [aiSettingsTag],
    }),
    setAiKey: build.mutation<AiSettings, string>({
      queryFn: (apiKey, { signal }) =>
        apiCall(
          apiClient.PUT('/api/ai/settings/key', { body: { apiKey }, signal }),
          mapAiSettings,
          aiApiError,
        ),
      invalidatesTags: [aiSettingsTag],
    }),
    removeAiKey: build.mutation<AiSettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.DELETE('/api/ai/settings/key', { signal }), mapAiSettings, aiApiError),
      invalidatesTags: [aiSettingsTag],
    }),
    updateAiPrompt: build.mutation<AiSettings, { key: string; text: string }>({
      queryFn: ({ key, text }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/ai/settings/prompts/{key}', {
            params: { path: { key: key } },
            body: { text },
            signal,
          }),
          mapAiSettings,
          aiApiError,
        ),
      invalidatesTags: [aiSettingsTag],
    }),
    testAiConnection: build.mutation<AiTestResult, AiModelTier>({
      queryFn: (tier, { signal }) =>
        apiCall(
          apiClient.POST('/api/ai/settings/test', { body: { tier }, signal }),
          mapAiTestResult,
          aiApiError,
        ),
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

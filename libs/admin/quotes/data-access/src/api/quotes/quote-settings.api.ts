import { apiCall, apiClient } from '@admin/shared/api-client';

import { toQuoteApiError } from '../../errors/quote-api-error';
import { mapQuoteSettings, toSaveQuoteSettingsInput } from '../../mappers/quote-settings.mapper';
import { quotesBaseApi } from '../base/quotes-base-api';

import type { QuoteSettings, QuoteSettingsDraft } from '@admin/quotes/model';
import type { AdminApiErrorMessages } from '@admin/shared/api-client';

const settingsErrors = {
  unauthorized: 'Налаштування КП змінює лише директор або адміністратор.',
  conflict: 'Налаштування змінили в іншому вікні. Оновіть сторінку.',
  fallback: 'Не вдалося зберегти налаштування. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

const tag = [{ type: 'QuoteSettings' as const, id: 'SINGLE' }];
const errors = (response: unknown) => toQuoteApiError(response, settingsErrors);

export const quoteSettingsApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuoteSettings: build.query<QuoteSettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/crm/quote-settings', { signal }), mapQuoteSettings, errors),
      providesTags: tag,
    }),
    saveQuoteSettings: build.mutation<QuoteSettings, QuoteSettingsDraft>({
      queryFn: (draft, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/quote-settings', {
            body: toSaveQuoteSettingsInput(draft),
            signal,
          }),
          mapQuoteSettings,
          errors,
        ),
      async onQueryStarted(_draft, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(quoteSettingsApi.util.upsertQueryData('getQuoteSettings', undefined, data));
        } catch {
          // The page shows the error.
        }
      },
    }),
  }),
});

export const { useGetQuoteSettingsQuery, useSaveQuoteSettingsMutation } = quoteSettingsApi;

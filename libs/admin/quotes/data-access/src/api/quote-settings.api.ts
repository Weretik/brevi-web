import { quotesBaseApi } from './quotes-base-api';
import { toQuoteApiError } from '../errors/quote-api-error';
import { mapQuoteSettings, toSaveQuoteSettingsInput } from '../mappers/quote-settings.mapper';

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
      query: () => '/api/crm/quote-settings',
      transformResponse: mapQuoteSettings,
      transformErrorResponse: errors,
      providesTags: tag,
    }),
    saveQuoteSettings: build.mutation<QuoteSettings, QuoteSettingsDraft>({
      query: (draft) => ({
        url: '/api/crm/quote-settings',
        method: 'PUT',
        body: toSaveQuoteSettingsInput(draft),
      }),
      transformResponse: mapQuoteSettings,
      transformErrorResponse: errors,
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

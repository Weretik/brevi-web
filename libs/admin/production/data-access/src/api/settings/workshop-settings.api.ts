import { apiCall, apiClient } from '@admin/shared/api-client';

import { toProductionApiError } from '../../errors/production-api-error';
import { mapWorkshopSettings } from '../../mappers/orders/card/production-tracking.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type { WorkshopSettings, WorkshopSettingsBody } from '@admin/production/model';
import type { AdminApiErrorMessages } from '@admin/shared/api-client';
import type { components } from '@admin/shared/contracts';

const settingsInput = (
  body: WorkshopSettingsBody,
): components['schemas']['WorkshopSettingsInput'] => body;

const messages = {
  unauthorized: 'Налаштування цеху змінює начальник цеху або адміністратор.',
  notFound: 'Налаштування не знайдено.',
  conflict: 'Не вдалося надіслати: спершу оберіть групу цеху.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

const errors = (response: unknown) => toProductionApiError(response, messages);
const tag = { type: 'WorkshopSettings' as const, id: 'ONE' };

/** «Налаштування цеху»: the workshop group and topic for new orders. */
export const workshopSettingsApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkshopSettings: build.query<WorkshopSettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/production/settings', { signal }), mapWorkshopSettings, errors),
      providesTags: [tag],
    }),
    updateWorkshopSettings: build.mutation<WorkshopSettings, WorkshopSettingsBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/settings', { body: settingsInput(body), signal }),
          mapWorkshopSettings,
          errors,
        ),
      // The order cards say whether «Надіслати в цех» can work.
      invalidatesTags: (_result, error) => (error ? [] : [tag, { type: 'ProductionOrder' }]),
    }),
    sendWorkshopTelegramTest: build.mutation<void, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/settings/telegram-test', { signal }),
          undefined,
          errors,
        ),
    }),
  }),
});

export const {
  useGetWorkshopSettingsQuery,
  useSendWorkshopTelegramTestMutation,
  useUpdateWorkshopSettingsMutation,
} = workshopSettingsApi;

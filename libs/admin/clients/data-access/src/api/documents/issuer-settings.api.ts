import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import type { components, operations } from '@admin/shared/contracts';

export type ActiveIssuerSettings = components['schemas']['CrmActiveIssuerSettings'];
export type IssuerSettingsVersion = components['schemas']['CrmIssuerSettingsDetail'];
export type CreateIssuerVersionBody =
  operations['createCrmIssuerSettingsVersion']['requestBody']['content']['application/json'];
export type ActivateIssuerBody =
  operations['activateCrmIssuerSettings']['requestBody']['content']['application/json'];

const issuerError = (error: unknown) =>
  toAdminApiError(error, {
    conflict: 'Реквізити змінилися. Оновіть дані та перевірте версію перед активацією.',
    notFound: 'Версію реквізитів не знайдено.',
    badRequest: 'Перевірте реквізити продавця та текст шаблону.',
    fallback: 'Не вдалося виконати дію з реквізитами продавця.',
  });

export const issuerSettingsApi = adminApi
  .enhanceEndpoints({
    addTagTypes: ['IssuerSettings'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getIssuerSettings: build.query<ActiveIssuerSettings, void>({
        query: () => '/api/crm/issuer-settings',
        transformErrorResponse: issuerError,
        providesTags: [{ type: 'IssuerSettings', id: 'ACTIVE' }],
      }),
      createIssuerSettingsVersion: build.mutation<IssuerSettingsVersion, CreateIssuerVersionBody>({
        query: (body) => ({ url: '/api/crm/issuer-settings/versions', method: 'POST', body }),
        transformErrorResponse: issuerError,
      }),
      activateIssuerSettings: build.mutation<ActiveIssuerSettings, ActivateIssuerBody>({
        query: (body) => ({ url: '/api/crm/issuer-settings/active', method: 'PUT', body }),
        transformErrorResponse: issuerError,
        invalidatesTags: [{ type: 'IssuerSettings', id: 'ACTIVE' }],
      }),
    }),
  });

export const {
  useGetIssuerSettingsQuery,
  useCreateIssuerSettingsVersionMutation,
  useActivateIssuerSettingsMutation,
} = issuerSettingsApi;

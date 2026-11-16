import { adminApi, apiCall, apiClient, toAdminApiError } from '@admin/shared/api-client';

import { mapActivityEntriesPage, mapActivityFilterOptions } from './activity-log-response';

import type {
  ActivityEntriesPage,
  ActivityFilterOptions,
  ActivityQuery,
} from '@admin/activity-log/model';
import type { AdminApiError } from '@admin/shared/api-client';

function activityLogApiError(value: unknown): AdminApiError {
  return toAdminApiError(value, {
    unauthorized: 'Немає прав на «Журнал дій».',
    badRequest: 'Перевірте фільтри.',
  });
}

/** «Журнал дій»: one page of entries and the options of its filters (read only). */
export const activityLogApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getActivityEntries: build.query<ActivityEntriesPage, ActivityQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/activity-log/entries', { params: { query }, signal }),
          mapActivityEntriesPage,
          activityLogApiError,
        ),
    }),
    getActivityFilters: build.query<ActivityFilterOptions, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/activity-log/filters', { signal }),
          mapActivityFilterOptions,
          activityLogApiError,
        ),
    }),
  }),
});

export const { useGetActivityEntriesQuery, useGetActivityFiltersQuery } = activityLogApi;

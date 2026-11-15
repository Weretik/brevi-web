import { apiCall, apiClient } from '@admin/shared/api-client';

import { reminderOccurrencesTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import {
  mapReminderOccurrence,
  mapReminderOccurrencePage,
} from '../../mappers/occurrences/reminder-occurrence.mapper';

import type { RemindersEndpointBuilder } from '../base/reminders-endpoint-builder';
import type {
  ReminderOccurrence,
  ReminderOccurrencePage,
  ReminderOccurrenceQuery,
} from '@admin/reminders/model';

export function reminderOccurrenceEndpoints(build: RemindersEndpointBuilder) {
  return {
    getReminderOccurrences: build.query<ReminderOccurrencePage, ReminderOccurrenceQuery>({
      queryFn: ({ status, taskId, page, pageSize }, { signal }) =>
        apiCall(
          apiClient.GET('/api/reminders/occurrences', {
            params: { query: { status, taskId, page, pageSize } },
            signal,
          }),
          mapReminderOccurrencePage,
          reminderApiError,
        ),
      providesTags: [reminderOccurrencesTag],
    }),
    closeReminderOccurrence: build.mutation<ReminderOccurrence, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/occurrences/{id}/close', {
            params: { path: { id: id } },
            signal,
          }),
          mapReminderOccurrence,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [reminderOccurrencesTag]),
    }),
    reopenReminderOccurrence: build.mutation<ReminderOccurrence, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/occurrences/{id}/reopen', {
            params: { path: { id: id } },
            signal,
          }),
          mapReminderOccurrence,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [reminderOccurrencesTag]),
    }),
  };
}

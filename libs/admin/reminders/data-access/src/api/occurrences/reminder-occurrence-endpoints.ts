import { reminderOccurrencesTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import {
  mapReminderOccurrence,
  mapReminderOccurrencePage,
} from '../../mappers/occurrences/reminder-occurrence.mapper';

import type { RemindersEndpointBuilder } from '../reminders-endpoint-builder';
import type {
  ReminderOccurrence,
  ReminderOccurrencePage,
  ReminderOccurrenceQuery,
} from '@admin/reminders/model';

export function reminderOccurrenceEndpoints(build: RemindersEndpointBuilder) {
  return {
    getReminderOccurrences: build.query<ReminderOccurrencePage, ReminderOccurrenceQuery>({
      query: ({ status, taskId, page, pageSize }) => ({
        url: '/api/reminders/occurrences',
        params: { status, taskId, page, pageSize },
      }),
      transformResponse: mapReminderOccurrencePage,
      transformErrorResponse: reminderApiError,
      providesTags: [reminderOccurrencesTag],
    }),
    closeReminderOccurrence: build.mutation<ReminderOccurrence, number>({
      query: (id) => ({ url: `/api/reminders/occurrences/${id}/close`, method: 'POST' }),
      transformResponse: mapReminderOccurrence,
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : [reminderOccurrencesTag]),
    }),
    reopenReminderOccurrence: build.mutation<ReminderOccurrence, number>({
      query: (id) => ({ url: `/api/reminders/occurrences/${id}/reopen`, method: 'POST' }),
      transformResponse: mapReminderOccurrence,
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : [reminderOccurrencesTag]),
    }),
  };
}

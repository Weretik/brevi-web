import { apiCall, apiClient } from '@admin/shared/api-client';

import { calendarChangeTags, nonWorkingDaysTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import { mapNonWorkingDay, mapNonWorkingDays } from '../../mappers/calendar/non-working-day.mapper';

import type { RemindersEndpointBuilder } from '../base/reminders-endpoint-builder';
import type { NonWorkingDay } from '@admin/reminders/model';
import type { components } from '@admin/shared/contracts';

export function nonWorkingDayEndpoints(build: RemindersEndpointBuilder) {
  return {
    getNonWorkingDays: build.query<NonWorkingDay[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reminders/non-working-days', { signal }),
          mapNonWorkingDays,
          reminderApiError,
        ),
      providesTags: [nonWorkingDaysTag],
    }),
    addNonWorkingDay: build.mutation<NonWorkingDay, NonWorkingDay>({
      queryFn: (day, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/non-working-days', {
            body: {
              date: day.date,
              note: day.note,
            } satisfies components['schemas']['NonWorkingDayInput'],
            signal,
          }),
          mapNonWorkingDay,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : calendarChangeTags),
    }),
    removeNonWorkingDay: build.mutation<void, string>({
      queryFn: (date, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reminders/non-working-days/{date}', {
            params: { path: { date: date } },
            signal,
          }),
          undefined,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : calendarChangeTags),
    }),
  };
}

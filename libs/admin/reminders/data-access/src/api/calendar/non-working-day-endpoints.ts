import { calendarChangeTags, nonWorkingDaysTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import { mapNonWorkingDay, mapNonWorkingDays } from '../../mappers/calendar/non-working-day.mapper';

import type { RemindersEndpointBuilder } from '../reminders-endpoint-builder';
import type { NonWorkingDay } from '@admin/reminders/model';
import type { components } from '@admin/shared/contracts';

export function nonWorkingDayEndpoints(build: RemindersEndpointBuilder) {
  return {
    getNonWorkingDays: build.query<NonWorkingDay[], void>({
      query: () => '/api/reminders/non-working-days',
      transformResponse: mapNonWorkingDays,
      transformErrorResponse: reminderApiError,
      providesTags: [nonWorkingDaysTag],
    }),
    addNonWorkingDay: build.mutation<NonWorkingDay, NonWorkingDay>({
      query: (day) => ({
        url: '/api/reminders/non-working-days',
        method: 'POST',
        body: {
          date: day.date,
          note: day.note,
        } satisfies components['schemas']['NonWorkingDayInput'],
      }),
      transformResponse: mapNonWorkingDay,
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : calendarChangeTags),
    }),
    removeNonWorkingDay: build.mutation<void, string>({
      query: (date) => ({ url: `/api/reminders/non-working-days/${date}`, method: 'DELETE' }),
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : calendarChangeTags),
    }),
  };
}

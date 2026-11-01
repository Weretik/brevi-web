import { reminderOccurrencesTag, reminderTasksTag } from '../../cache/reminder-cache-tags';
import { reminderApiError } from '../../errors/reminder-api-error';
import { reminderScheduleBody, reminderTaskBody } from '../../mappers/tasks/reminder-task-body';
import {
  mapDueDatePreviews,
  mapReminderTask,
  mapReminderTasks,
} from '../../mappers/tasks/reminder-task.mapper';

import type {
  AssignReminderChatRequest,
  PreviewReminderDueDatesRequest,
  UpdateReminderTaskRequest,
} from '../../models/reminder-requests';
import type { RemindersEndpointBuilder } from '../reminders-endpoint-builder';
import type { DueDatePreview, ReminderTask, ReminderTaskInput } from '@admin/reminders/model';
import type { operations } from '@admin/shared/contracts';

type Body<T extends keyof operations> = operations[T] extends {
  requestBody?: { content: { 'application/json': infer B } };
}
  ? B
  : never;

export function reminderTaskEndpoints(build: RemindersEndpointBuilder) {
  return {
    getReminderTasks: build.query<ReminderTask[], void>({
      query: () => '/api/reminders/tasks',
      transformResponse: mapReminderTasks,
      transformErrorResponse: reminderApiError,
      providesTags: [reminderTasksTag],
    }),
    createReminderTask: build.mutation<ReminderTask, ReminderTaskInput>({
      query: (input) => ({
        url: '/api/reminders/tasks',
        method: 'POST',
        body: reminderTaskBody(input) satisfies Body<'createReminderTask'>,
      }),
      transformResponse: mapReminderTask,
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag]),
    }),
    updateReminderTask: build.mutation<ReminderTask, UpdateReminderTaskRequest>({
      query: ({ id, input }) => ({
        url: `/api/reminders/tasks/${id}`,
        method: 'PUT',
        body: reminderTaskBody(input) satisfies Body<'updateReminderTask'>,
      }),
      transformResponse: mapReminderTask,
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag, reminderOccurrencesTag]),
    }),
    archiveReminderTask: build.mutation<void, number>({
      query: (id) => ({ url: `/api/reminders/tasks/${id}`, method: 'DELETE' }),
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag, reminderOccurrencesTag]),
    }),
    previewReminderDueDates: build.query<DueDatePreview[], PreviewReminderDueDatesRequest>({
      query: ({ schedule, from }) => ({
        url: '/api/reminders/tasks/preview',
        method: 'POST',
        body: {
          schedule: reminderScheduleBody(schedule),
          from: from ?? null,
        } satisfies Body<'previewReminderDueDates'>,
      }),
      transformResponse: mapDueDatePreviews,
      transformErrorResponse: reminderApiError,
      providesTags: [reminderTasksTag],
    }),
    assignReminderChat: build.mutation<number, AssignReminderChatRequest>({
      query: (request) => ({
        url: '/api/reminders/tasks/assign-chat',
        method: 'POST',
        body: { ...request } satisfies Body<'assignReminderChat'>,
      }),
      transformResponse: (value: unknown) => (typeof value === 'number' ? value : 0),
      transformErrorResponse: reminderApiError,
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag]),
    }),
  };
}

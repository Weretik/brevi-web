import { apiCall, apiClient } from '@admin/shared/api-client';

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
import type { RemindersEndpointBuilder } from '../base/reminders-endpoint-builder';
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
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/reminders/tasks', { signal }),
          mapReminderTasks,
          reminderApiError,
        ),
      providesTags: [reminderTasksTag],
    }),
    createReminderTask: build.mutation<ReminderTask, ReminderTaskInput>({
      queryFn: (input, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/tasks', {
            body: reminderTaskBody(input) satisfies Body<'createReminderTask'>,
            signal,
          }),
          mapReminderTask,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag]),
    }),
    updateReminderTask: build.mutation<ReminderTask, UpdateReminderTaskRequest>({
      queryFn: ({ id, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/reminders/tasks/{id}', {
            params: { path: { id: id } },
            body: reminderTaskBody(input) satisfies Body<'updateReminderTask'>,
            signal,
          }),
          mapReminderTask,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag, reminderOccurrencesTag]),
    }),
    archiveReminderTask: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/reminders/tasks/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag, reminderOccurrencesTag]),
    }),
    previewReminderDueDates: build.query<DueDatePreview[], PreviewReminderDueDatesRequest>({
      queryFn: ({ schedule, from }, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/tasks/preview', {
            body: {
              schedule: reminderScheduleBody(schedule),
              from: from ?? null,
            } satisfies Body<'previewReminderDueDates'>,
            signal,
          }),
          mapDueDatePreviews,
          reminderApiError,
        ),
      providesTags: [reminderTasksTag],
    }),
    assignReminderChat: build.mutation<number, AssignReminderChatRequest>({
      queryFn: (request, { signal }) =>
        apiCall(
          apiClient.POST('/api/reminders/tasks/assign-chat', {
            body: { ...request } satisfies Body<'assignReminderChat'>,
            signal,
          }),
          (value: unknown) => (typeof value === 'number' ? value : 0),
          reminderApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [reminderTasksTag]),
    }),
  };
}

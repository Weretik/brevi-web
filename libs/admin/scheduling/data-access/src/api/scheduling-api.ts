import { adminApi } from '@admin/shared/api-client';

import { schedulingApiError } from './scheduling-api-error';
import {
  mapScheduledTask,
  mapScheduledTaskRuns,
  mapScheduledTasks,
} from '../mappers/scheduled-task.mapper';

import type {
  ScheduledTask,
  ScheduledTaskRun,
  ScheduledTaskScheduleInput,
} from '@admin/scheduling/model';

const tasksTag = { type: 'ScheduledTask' as const, id: 'LIST' };
const runsTag = (key: string) => ({ type: 'ScheduledTaskRun' as const, id: key });

const schedulingBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['ScheduledTask', 'ScheduledTaskRun'],
});

const taskUrl = (key: string, rest: string) =>
  `/api/scheduling/tasks/${encodeURIComponent(key)}/${rest}`;

/** «Фонові задачі»: the list, the history of one task, the schedule and «Запустити зараз». */
export const schedulingApi = schedulingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getScheduledTasks: build.query<ScheduledTask[], void>({
      query: () => ({ url: '/api/scheduling/tasks' }),
      transformResponse: mapScheduledTasks,
      transformErrorResponse: schedulingApiError,
      providesTags: [tasksTag],
    }),
    getScheduledTaskRuns: build.query<ScheduledTaskRun[], string>({
      query: (key) => ({ url: taskUrl(key, 'runs') }),
      transformResponse: mapScheduledTaskRuns,
      transformErrorResponse: schedulingApiError,
      providesTags: (_result, _error, key) => [runsTag(key)],
    }),
    updateScheduledTaskSchedule: build.mutation<
      ScheduledTask,
      { key: string; input: ScheduledTaskScheduleInput }
    >({
      query: ({ key, input }) => ({ url: taskUrl(key, 'schedule'), method: 'PUT', body: input }),
      transformResponse: mapScheduledTask,
      transformErrorResponse: schedulingApiError,
      invalidatesTags: [tasksTag],
    }),
    runScheduledTaskNow: build.mutation<ScheduledTask, string>({
      query: (key) => ({ url: taskUrl(key, 'run'), method: 'POST' }),
      transformResponse: mapScheduledTask,
      transformErrorResponse: schedulingApiError,
      invalidatesTags: (_result, _error, key) => [tasksTag, runsTag(key)],
    }),
  }),
});

export const {
  useGetScheduledTaskRunsQuery,
  useGetScheduledTasksQuery,
  useRunScheduledTaskNowMutation,
  useUpdateScheduledTaskScheduleMutation,
} = schedulingApi;

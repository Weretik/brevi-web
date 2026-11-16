import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

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

/** «Фонові задачі»: the list, the history of one task, the schedule and «Запустити зараз». */
export const schedulingApi = schedulingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getScheduledTasks: build.query<ScheduledTask[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/scheduling/tasks', { signal }),
          mapScheduledTasks,
          schedulingApiError,
        ),
      providesTags: [tasksTag],
    }),
    getScheduledTaskRuns: build.query<ScheduledTaskRun[], string>({
      queryFn: (key, { signal }) =>
        apiCall(
          apiClient.GET('/api/scheduling/tasks/{key}/runs', {
            params: { path: { key: key } },
            signal,
          }),
          mapScheduledTaskRuns,
          schedulingApiError,
        ),
      providesTags: (_result, _error, key) => [runsTag(key)],
    }),
    updateScheduledTaskSchedule: build.mutation<
      ScheduledTask,
      { key: string; input: ScheduledTaskScheduleInput }
    >({
      queryFn: ({ key, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/scheduling/tasks/{key}/schedule', {
            params: { path: { key: key } },
            body: input,
            signal,
          }),
          mapScheduledTask,
          schedulingApiError,
        ),
      invalidatesTags: [tasksTag],
    }),
    runScheduledTaskNow: build.mutation<ScheduledTask, string>({
      queryFn: (key, { signal }) =>
        apiCall(
          apiClient.POST('/api/scheduling/tasks/{key}/run', {
            params: { path: { key: key } },
            signal,
          }),
          mapScheduledTask,
          schedulingApiError,
        ),
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

import { tasksBaseApi } from './tasks-base-api';
import { toTaskApiError } from '../errors/task-api-error';
import { toSaveTaskInput } from '../mappers/task-input.mapper';
import {
  mapTaskAssignees,
  mapTaskBoard,
  mapTaskDetail,
  mapTaskOverview,
  mapTaskPage,
} from '../mappers/task.mapper';

import type {
  TaskAssignee,
  TaskDetail,
  TaskFormValues,
  TaskListQuery,
  TaskOverview,
  TaskPage,
  TaskSummary,
} from '@admin/tasks/model';

const list = [{ type: 'ManagerTaskList' as const, id: 'LIST' }];

/** Every change refreshes the list, the board, the overview and the changed task. */
const changed = (error: unknown, id?: number) =>
  error ? [] : [...list, ...(id ? [{ type: 'ManagerTask' as const, id }] : [])];

export const tasksApi = tasksBaseApi.injectEndpoints({
  endpoints: (build) => ({
    listTasks: build.query<TaskPage, TaskListQuery>({
      query: (query) => ({
        url: '/api/crm/tasks',
        params: {
          search: query.search.trim() || undefined,
          filter: query.filter,
          assigneeUserId: query.assigneeUserId ?? undefined,
          page: query.page,
          pageSize: query.pageSize,
        },
      }),
      transformResponse: mapTaskPage,
      transformErrorResponse: toTaskApiError,
      providesTags: list,
    }),
    getTaskBoard: build.query<readonly TaskSummary[], { assigneeUserId: number | null }>({
      query: ({ assigneeUserId }) => ({
        url: '/api/crm/tasks/board',
        params: { assigneeUserId: assigneeUserId ?? undefined },
      }),
      transformResponse: mapTaskBoard,
      transformErrorResponse: toTaskApiError,
      providesTags: list,
    }),
    getTaskOverview: build.query<TaskOverview, { assigneeUserId: number | null }>({
      query: ({ assigneeUserId }) => ({
        url: '/api/crm/tasks/overview',
        params: { assigneeUserId: assigneeUserId ?? undefined },
      }),
      transformResponse: mapTaskOverview,
      transformErrorResponse: toTaskApiError,
      providesTags: list,
    }),
    getTaskAssignees: build.query<readonly TaskAssignee[], void>({
      query: () => '/api/crm/tasks/assignees',
      transformResponse: mapTaskAssignees,
      transformErrorResponse: toTaskApiError,
    }),
    getTask: build.query<TaskDetail, number>({
      query: (id) => `/api/crm/tasks/${id}`,
      transformResponse: mapTaskDetail,
      transformErrorResponse: toTaskApiError,
      providesTags: (_result, _error, id) => [{ type: 'ManagerTask', id }],
    }),
    createTask: build.mutation<TaskDetail, TaskFormValues>({
      query: (values) => ({ url: '/api/crm/tasks', method: 'POST', body: toSaveTaskInput(values) }),
      transformResponse: mapTaskDetail,
      transformErrorResponse: toTaskApiError,
      invalidatesTags: (_result, error) => changed(error),
    }),
    editTask: build.mutation<TaskDetail, { id: number; values: TaskFormValues }>({
      query: ({ id, values }) => ({
        url: `/api/crm/tasks/${id}`,
        method: 'PUT',
        body: toSaveTaskInput(values),
      }),
      transformResponse: mapTaskDetail,
      transformErrorResponse: toTaskApiError,
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    changeTaskStatus: build.mutation<
      TaskDetail,
      { id: number; version: number; status: 'New' | 'InProgress' | 'Done' }
    >({
      query: ({ id, version, status }) => ({
        url: `/api/crm/tasks/${id}/status`,
        method: 'PUT',
        body: { version, status },
      }),
      transformResponse: mapTaskDetail,
      transformErrorResponse: toTaskApiError,
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    setTaskUrgent: build.mutation<TaskDetail, { id: number; version: number; isUrgent: boolean }>({
      query: ({ id, version, isUrgent }) => ({
        url: `/api/crm/tasks/${id}/urgent`,
        method: 'PUT',
        body: { version, isUrgent },
      }),
      transformResponse: mapTaskDetail,
      transformErrorResponse: toTaskApiError,
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    markTaskStep: build.mutation<
      TaskDetail,
      { id: number; stepId: number; version: number; isDone: boolean }
    >({
      query: ({ id, stepId, version, isDone }) => ({
        url: `/api/crm/tasks/${id}/steps/${stepId}`,
        method: 'PUT',
        body: { version, isDone },
      }),
      transformResponse: mapTaskDetail,
      transformErrorResponse: toTaskApiError,
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    deleteTask: build.mutation<void, { id: number; version: number }>({
      query: ({ id, version }) => ({
        url: `/api/crm/tasks/${id}`,
        method: 'DELETE',
        params: { version },
      }),
      transformErrorResponse: toTaskApiError,
      invalidatesTags: (_result, error) => changed(error),
    }),
  }),
});

export const {
  useChangeTaskStatusMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useEditTaskMutation,
  useGetTaskAssigneesQuery,
  useGetTaskBoardQuery,
  useGetTaskOverviewQuery,
  useGetTaskQuery,
  useListTasksQuery,
  useMarkTaskStepMutation,
  useSetTaskUrgentMutation,
} = tasksApi;

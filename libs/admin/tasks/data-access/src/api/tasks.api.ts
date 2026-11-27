import { apiCall, apiClient } from '@admin/shared/api-client';

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
  TaskBoardPeriod,
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
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/tasks', {
            params: {
              query: {
                search: query.search.trim() || undefined,
                filter: query.filter,
                assigneeUserId: query.assigneeUserId ?? undefined,
                page: query.page,
                pageSize: query.pageSize,
                customerPublicId: query.customerPublicId,
                from: query.from,
                to: query.to,
              },
            },
            signal,
          }),
          mapTaskPage,
          toTaskApiError,
        ),
      providesTags: list,
    }),
    getTaskBoard: build.query<
      readonly TaskSummary[],
      { assigneeUserId: number | null; period: TaskBoardPeriod }
    >({
      queryFn: ({ assigneeUserId, period }, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/tasks/board', {
            params: { query: { assigneeUserId: assigneeUserId ?? undefined, period } },
            signal,
          }),
          mapTaskBoard,
          toTaskApiError,
        ),
      providesTags: list,
    }),
    getTaskOverview: build.query<TaskOverview, { assigneeUserId: number | null }>({
      queryFn: ({ assigneeUserId }, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/tasks/overview', {
            params: { query: { assigneeUserId: assigneeUserId ?? undefined } },
            signal,
          }),
          mapTaskOverview,
          toTaskApiError,
        ),
      providesTags: list,
    }),
    getTaskAssignees: build.query<readonly TaskAssignee[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/tasks/assignees', { signal }),
          mapTaskAssignees,
          toTaskApiError,
        ),
    }),
    getTask: build.query<TaskDetail, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/tasks/{id}', { params: { path: { id: id } }, signal }),
          mapTaskDetail,
          toTaskApiError,
        ),
      providesTags: (_result, _error, id) => [{ type: 'ManagerTask', id }],
    }),
    createTask: build.mutation<TaskDetail, TaskFormValues>({
      queryFn: (values, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/tasks', { body: toSaveTaskInput(values), signal }),
          mapTaskDetail,
          toTaskApiError,
        ),
      invalidatesTags: (_result, error) => changed(error),
    }),
    editTask: build.mutation<TaskDetail, { id: number; values: TaskFormValues }>({
      queryFn: ({ id, values }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/tasks/{id}', {
            params: { path: { id: id } },
            body: toSaveTaskInput(values),
            signal,
          }),
          mapTaskDetail,
          toTaskApiError,
        ),
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    changeTaskStatus: build.mutation<
      TaskDetail,
      { id: number; version: number; status: 'New' | 'InProgress' | 'Done' }
    >({
      queryFn: ({ id, version, status }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/tasks/{id}/status', {
            params: { path: { id: id } },
            body: { version, status },
            signal,
          }),
          mapTaskDetail,
          toTaskApiError,
        ),
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    setTaskUrgent: build.mutation<TaskDetail, { id: number; version: number; isUrgent: boolean }>({
      queryFn: ({ id, version, isUrgent }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/tasks/{id}/urgent', {
            params: { path: { id: id } },
            body: { version, isUrgent },
            signal,
          }),
          mapTaskDetail,
          toTaskApiError,
        ),
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    markTaskStep: build.mutation<
      TaskDetail,
      { id: number; stepId: number; version: number; isDone: boolean }
    >({
      queryFn: ({ id, stepId, version, isDone }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/tasks/{id}/steps/{stepId}', {
            params: { path: { id: id, stepId: stepId } },
            body: { version, isDone },
            signal,
          }),
          mapTaskDetail,
          toTaskApiError,
        ),
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    deleteTask: build.mutation<void, { id: number; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/crm/tasks/{id}', {
            params: { path: { id: id }, query: { version } },
            signal,
          }),
          undefined,
          toTaskApiError,
        ),
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

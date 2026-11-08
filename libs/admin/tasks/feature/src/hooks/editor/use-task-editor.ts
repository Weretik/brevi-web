import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  useChangeTaskStatusMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useEditTaskMutation,
  useGetTaskAssigneesQuery,
  useGetTaskQuery,
  useMarkTaskStepMutation,
} from '@admin/tasks/data-access';
import { emptyTaskForm, taskFormFromDetail, validateTaskForm } from '@admin/tasks/model';
import { useState } from 'react';

import { useTaskCustomers } from './use-task-customers';

import type { TaskFormValues, TaskViewer } from '@admin/tasks/model';

type Mode = { kind: 'create' } | { kind: 'view'; id: number } | { kind: 'edit'; id: number };

const failed = 'Не вдалося зберегти завдання. Спробуйте ще раз.';

/**
 * The one side panel of both task pages: everyone opens a task and works with its status and
 * steps; Director and Admin also create, edit and delete it (TSK-001 R-01…R-03, R-07).
 */
export function useTaskEditor(viewer: TaskViewer, notify: (message: string) => void) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [values, setValues] = useState<TaskFormValues>(() => emptyTaskForm(new Date()));
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const taskId = mode && mode.kind !== 'create' ? mode.id : null;
  const detail = useGetTaskQuery(taskId ?? 0, { skip: taskId === null });
  const editing = mode !== null && mode.kind !== 'view';
  // Director and Admin also pick another manager in the read view (R-13).
  const assignees = useGetTaskAssigneesQuery(undefined, { skip: !viewer.isAdmin || mode === null });
  const customers = useTaskCustomers(editing);

  const [createTask, createState] = useCreateTaskMutation();
  const [editTask, editState] = useEditTaskMutation();
  const [changeStatus, statusState] = useChangeTaskStatusMutation();
  const [markStep, stepState] = useMarkTaskStepMutation();
  const [deleteTask, deleteState] = useDeleteTaskMutation();

  const errors = validateTaskForm(values);
  const task = detail.data ?? null;

  function reset(next: Mode | null) {
    setMode(next);
    setShowErrors(false);
    setError(null);
    setConfirmingDelete(false);
  }

  async function run(action: () => Promise<unknown>, message: string | null) {
    setError(null);
    try {
      await action();
      if (message) notify(message);
      return true;
    } catch (cause) {
      setError(adminApiErrorMessage(cause, failed));
      return false;
    }
  }

  return {
    mode,
    task,
    loading: detail.isFetching && !task,
    loadError: detail.isError ? adminApiErrorMessage(detail.error, failed) : null,
    values,
    errors,
    showErrors,
    error,
    assignees: assignees.data ?? [],
    customers: customers.options,
    searchCustomers: customers.search,
    saving: createState.isLoading || editState.isLoading,
    busy: statusState.isLoading || stepState.isLoading || editState.isLoading,
    deleting: deleteState.isLoading,
    confirmingDelete,
    open: (id: number) => reset({ kind: 'view', id }),
    create: (assigneeUserId: number | null = null) => {
      setValues(emptyTaskForm(new Date(), assigneeUserId));
      reset({ kind: 'create' });
    },
    edit: () => {
      if (!task) return;
      setValues(taskFormFromDetail(task));
      reset({ kind: 'edit', id: task.id });
    },
    close: () => reset(null),
    change: setValues,
    submit: async () => {
      setShowErrors(true);
      if (!mode || mode.kind === 'view' || Object.keys(errors).length > 0) return;
      setError(null);
      try {
        const saved =
          mode.kind === 'create'
            ? await createTask(values).unwrap()
            : await editTask({ id: mode.id, values }).unwrap();
        notify(mode.kind === 'create' ? `Завдання ${saved.number} поставлено` : 'Зміни збережено');
        reset({ kind: 'view', id: saved.id });
      } catch (cause) {
        setError(adminApiErrorMessage(cause, failed));
      }
    },
    setStatus: (status: 'InProgress' | 'Done') =>
      task &&
      void run(
        () => changeStatus({ id: task.id, version: task.version, status }).unwrap(),
        status === 'Done' ? `Завдання ${task.number} виконано` : null,
      ),
    /** «Виконано» in the panel footer: marks the task done and closes the panel (round 2, item 9). */
    complete: async () => {
      if (!task) return;
      const done = await run(
        () => changeStatus({ id: task.id, version: task.version, status: 'Done' }).unwrap(),
        `Завдання ${task.number} виконано`,
      );
      if (done) reset(null);
    },
    setStep: (stepId: number, isDone: boolean) =>
      task &&
      void run(
        () => markStep({ id: task.id, stepId, version: task.version, isDone }).unwrap(),
        null,
      ),
    /** «Передати іншому менеджеру» right from the read view; everything else stays as saved. */
    reassign: (assigneeUserId: number) => {
      if (!task || assigneeUserId === task.assignee.userId) return;
      const name = assignees.data?.find((x) => x.userId === assigneeUserId)?.name ?? 'менеджеру';
      void run(
        () =>
          editTask({
            id: task.id,
            values: { ...taskFormFromDetail(task), assigneeUserId },
          }).unwrap(),
        `Завдання ${task.number} передано: ${name}`,
      );
    },
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete: async () => {
      if (!task) return;
      const done = await run(
        () => deleteTask({ id: task.id, version: task.version }).unwrap(),
        `Завдання ${task.number} видалено`,
      );
      if (done) reset(null);
      else setConfirmingDelete(false);
    },
  };
}

export type TaskEditor = ReturnType<typeof useTaskEditor>;

import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  useChangeTaskStatusMutation,
  useGetTaskAssigneesQuery,
  useGetTaskBoardQuery,
  useGetTaskOverviewQuery,
  useSetTaskUrgentMutation,
} from '@admin/tasks/data-access';
import { useState } from 'react';

import type { TaskBoardPeriod, TaskMove, TaskSummary, TaskViewer } from '@admin/tasks/model';

/**
 * «Мої завдання»: a Manager sees own cards; Director and Admin see everyone's and switch the
 * manager filter (TSK-001 R-02). «Період» narrows only the done cards (open ones always stay); every column is
 * newest added first. A drop calls the status or urgent endpoint with the card version.
 */
export function useTaskBoard(viewer: TaskViewer, notify: (message: string) => void) {
  const [assigneeUserId, setAssignee] = useState<number | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TaskBoardPeriod>('Week');
  const filter = viewer.isAdmin ? assigneeUserId : null;
  const board = useGetTaskBoardQuery({ assigneeUserId: filter, period });
  const overview = useGetTaskOverviewQuery({ assigneeUserId: filter });
  const assignees = useGetTaskAssigneesQuery(undefined, { skip: !viewer.isAdmin });
  const [changeStatus] = useChangeTaskStatusMutation();
  const [setUrgent] = useSetTaskUrgentMutation();

  async function move(task: TaskSummary, target: TaskMove) {
    setMoveError(null);
    try {
      if (target.kind === 'status') {
        await changeStatus({ id: task.id, version: task.version, status: target.status }).unwrap();
        if (target.status === 'Done') notify(`Завдання ${task.number} виконано`);
      } else {
        await setUrgent({ id: task.id, version: task.version, isUrgent: target.isUrgent }).unwrap();
      }
    } catch (cause) {
      setMoveError(adminApiErrorMessage(cause, 'Не вдалося перемістити картку.'));
    }
  }

  return {
    assigneeUserId: filter,
    setAssignee,
    period,
    setPeriod,
    assignees: assignees.data ?? [],
    tasks: board.data ?? [],
    overview: overview.data,
    loading: board.isFetching && !board.data,
    error: board.isError
      ? adminApiErrorMessage(board.error, 'Не вдалося завантажити дошку.')
      : null,
    moveError,
    clearMoveError: () => setMoveError(null),
    retry: () => void board.refetch(),
    move: (task: TaskSummary, target: TaskMove) => void move(task, target),
  };
}

import { lazy } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { TaskViewer } from '@admin/tasks/model';
import type { RouteObject } from 'react-router-dom';

const ManagerTasksPage = lazy(() => import('./pages/admin/manager-tasks-page'));
const TaskBoardPage = lazy(() => import('./pages/board/task-board-page'));

export interface TasksRouteOptions {
  /** The signed-in staff member; the app reads it from the session. */
  useTaskViewer: () => TaskViewer;
}

type TaskRoute = RouteObject & { path: string };

/**
 * `admin`: «Адміністрування › Завдання менеджерам» (page `manager-tasks`).
 * `board`: «Менеджер сервісу › Мої завдання» (page `tasks`).
 */
export function createTasksRoutes({ useTaskViewer }: TasksRouteOptions): {
  admin: TaskRoute[];
  board: TaskRoute[];
} {
  function Admin() {
    return <ManagerTasksPage viewer={useTaskViewer()} />;
  }
  function Board() {
    const [params] = useSearchParams();
    return (
      <TaskBoardPage viewer={useTaskViewer()} openTaskId={Number(params.get('task')) || null} />
    );
  }
  return {
    admin: [{ path: '/admin/tasks', element: <Admin /> }],
    board: [{ path: '/crm/tasks', element: <Board /> }],
  };
}

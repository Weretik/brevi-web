import { lazy } from 'react';

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
 * `admin`: «Адміністрування › Завдання менеджерам», the app puts it behind the Admin role.
 * `board`: «Менеджер сервісу › Мої завдання» for Manager, Director and Admin.
 */
export function createTasksRoutes({ useTaskViewer }: TasksRouteOptions): {
  admin: TaskRoute[];
  board: TaskRoute[];
} {
  function Admin() {
    return <ManagerTasksPage viewer={useTaskViewer()} />;
  }
  function Board() {
    return <TaskBoardPage viewer={useTaskViewer()} />;
  }
  return {
    admin: [{ path: '/admin/tasks', element: <Admin /> }],
    board: [{ path: '/crm/tasks', element: <Board /> }],
  };
}

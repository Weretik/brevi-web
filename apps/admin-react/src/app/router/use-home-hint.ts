import { useGetTaskOverviewQuery } from '@admin/tasks/data-access';
import { taskHomeHint } from '@admin/tasks/model';

import type { SessionUser } from '@admin/core/auth';

/** «Робочий стіл» second line from the signed-in person's tasks (all tasks for Director/Admin). */
export function useHomeHint(user: SessionUser): string | null {
  const worksOnTasks = user.roles.includes('Admin') || user.roles.includes('Manager');
  const overview = useGetTaskOverviewQuery({ assigneeUserId: null }, { skip: !worksOnTasks });
  return worksOnTasks ? taskHomeHint(overview.data) : null;
}

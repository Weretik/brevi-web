import { canAccess, useAdminSession } from '@admin/core/auth';

import type { TaskViewer } from '@admin/tasks/model';

/** The signed-in staff member as the task pages see them: «Завдання менеджерам» manages every task (ACC-002). */
export function useTaskViewer(): TaskViewer {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? { userId: Number(session.user.id), isAdmin: canAccess(session.user, 'manager-tasks') }
    : { userId: null, isAdmin: false };
}

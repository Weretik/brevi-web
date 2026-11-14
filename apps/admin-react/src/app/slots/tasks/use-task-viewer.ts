import { useAdminSession } from '@admin/core/auth';

import type { TaskViewer } from '@admin/tasks/model';

/** The signed-in staff member as the task pages see them: Director and Admin manage every task. */
export function useTaskViewer(): TaskViewer {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? { userId: Number(session.user.id), isAdmin: session.user.roles.includes('Admin') }
    : { userId: null, isAdmin: false };
}

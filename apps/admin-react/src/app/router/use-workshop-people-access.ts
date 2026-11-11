import { canAccess, useAdminSession } from '@admin/core/auth';

import type { WorkshopPeopleAccess } from '@admin/production/model';

/** Tabs of «Персонал цеху»: «Працівники цеху», «Робочий час» and «Зарплата» stay three pages of «Права доступу». */
export function useWorkshopPeopleAccess(): WorkshopPeopleAccess {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { staff: false, timesheet: false, payroll: false };
  const user = session.user;
  return {
    staff: canAccess(user, 'workshop-staff'),
    timesheet: canAccess(user, 'timesheet'),
    payroll: canAccess(user, 'payroll'),
  };
}

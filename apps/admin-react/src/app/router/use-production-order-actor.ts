import { useAdminSession } from '@admin/core/auth';

import type { ProductionOrderActor } from '@admin/production/model';

/** Admin and managers pass a КП to the workshop; only Admin imports the old «Цех» orders. */
export function useProductionOrderActor(): ProductionOrderActor {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canCreate: false, canImport: false };
  const roles = session.user.roles;
  return {
    canCreate: roles.includes('Admin') || roles.includes('Manager'),
    canImport: roles.includes('Admin'),
  };
}

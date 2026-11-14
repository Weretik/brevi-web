import { canAccess, useAdminSession } from '@admin/core/auth';

import type { ProductionOrderActor } from '@admin/production/model';

/**
 * A КП goes to the workshop by whoever may create «Виробничі завдання» and open КП; only Admin imports the old «Цех»
 * orders.
 */
export function useProductionOrderActor(): ProductionOrderActor {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canCreate: false, canImport: false };
  const user = session.user;
  return {
    canCreate: canAccess(user, 'production-orders', 'create') && canAccess(user, 'quotes'),
    canImport: user.roles.includes('Admin'),
  };
}

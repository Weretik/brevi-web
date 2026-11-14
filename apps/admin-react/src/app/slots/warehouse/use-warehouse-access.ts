import { canAccess, useAdminSession } from '@admin/core/auth';

import type { WarehouseAccess } from '@admin/warehouse/model';

/** Tabs of «Що замовити» and «Звіти»: each stays its own page of «Права доступу». */
export function useWarehouseAccess(): WarehouseAccess {
  const session = useAdminSession();
  if (session.status !== 'authenticated')
    return { stock: false, planFact: false, booking: false, valuation: false, hardware: false };
  const user = session.user;
  return {
    stock: canAccess(user, 'fabric-stock'),
    planFact: canAccess(user, 'fabric-plan-fact'),
    booking: canAccess(user, 'fabric-booking'),
    valuation: canAccess(user, 'fabric-valuation'),
    hardware: canAccess(user, 'hardware-order'),
  };
}

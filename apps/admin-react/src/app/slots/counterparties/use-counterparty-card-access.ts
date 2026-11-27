import { canAccess, canUsePurchaseInvoices, useAdminSession } from '@admin/core/auth';

import type { CustomerCardAccess } from '@admin/clients/feature';
import type { SupplierCardAccess } from '@admin/references/feature';

/** Client card tabs (CARD-001): each follows the «Права доступу» page of its list. */
export function useCustomerCardAccess(): CustomerCardAccess {
  const session = useAdminSession();
  const can = (page: string) => session.status === 'authenticated' && canAccess(session.user, page);
  return {
    quotes: can('quotes'),
    productionOrders: can('production-orders'),
    tasks: can('tasks'),
    embroidery: can('embroidery'),
    finance: can('accounting'),
  };
}

/** Supplier card tabs (CARD-001): each follows the «Права доступу» page of its list. */
export function useSupplierCardAccess(): SupplierCardAccess {
  const session = useAdminSession();
  const can = (page: string) => session.status === 'authenticated' && canAccess(session.user, page);
  return {
    materials: can('materials'),
    products: can('products'),
    fabricStock: can('fabric-stock'),
    purchaseInvoices: session.status === 'authenticated' && canUsePurchaseInvoices(session.user),
    finance: can('accounting'),
  };
}

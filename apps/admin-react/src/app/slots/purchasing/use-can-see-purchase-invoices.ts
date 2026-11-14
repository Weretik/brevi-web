import { canUsePurchaseInvoices, useAdminSession } from '@admin/core/auth';

/** «Рахунки на закупку» and the supplier's invoices: only the director. */
export function useCanSeePurchaseInvoices(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canUsePurchaseInvoices(session.user);
}

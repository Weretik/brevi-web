import { canUsePurchaseInvoices, useAdminSession } from '@admin/core/auth';

/** «Контрагенти → Рахунки на закупку»: the accountant and Admin; the manager does not see it. */
export function useCanSeePurchaseInvoices(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canUsePurchaseInvoices(session.user);
}

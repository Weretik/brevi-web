import { canUseAccounting, useAdminSession } from '@admin/core/auth';

/** «Фінанси» in the client and supplier cards: the «Бухгалтерія» right (only the director by default). */
export function useCanSeeFinance(): boolean {
  const session = useAdminSession();
  return session.status === 'authenticated' && canUseAccounting(session.user);
}

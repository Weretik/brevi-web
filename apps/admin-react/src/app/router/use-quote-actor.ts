import { useAdminSession } from '@admin/core/auth';

import type { QuoteActor } from '@admin/quotes/model';

/** The signed-in staff member as the КП screens see them: Director and Admin see every КП. */
export function useQuoteActor(): QuoteActor {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? { userId: Number(session.user.id), canSeeAll: session.user.roles.includes('Admin') }
    : { userId: null, canSeeAll: false };
}

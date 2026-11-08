import { useAdminSession } from '@admin/core/auth';

import type { QuoteActor } from '@admin/quotes/model';

/**
 * The signed-in staff member as the КП screens see them: Director and Admin see every КП; only the Director deletes
 * a КП until «Права доступу» makes it configurable (crm R-34).
 */
export function useQuoteActor(): QuoteActor {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? {
        userId: Number(session.user.id),
        canSeeAll: session.user.roles.includes('Admin'),
        canDelete: session.user.roles.includes('Director'),
      }
    : { userId: null, canSeeAll: false, canDelete: false };
}

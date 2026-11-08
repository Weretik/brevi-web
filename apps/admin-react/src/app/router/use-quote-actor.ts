import { canAccess, useAdminSession } from '@admin/core/auth';

import type { QuoteActor } from '@admin/quotes/model';

/**
 * The signed-in staff member as the КП screens see them: Director and Admin see every КП; deleting a КП is the
 * «Видаляти» right of «Комерційні пропозиції» (only the director by default).
 */
export function useQuoteActor(): QuoteActor {
  const session = useAdminSession();
  return session.status === 'authenticated'
    ? {
        userId: Number(session.user.id),
        canSeeAll: session.user.roles.includes('Admin'),
        canDelete: canAccess(session.user, 'quotes', 'delete'),
      }
    : { userId: null, canSeeAll: false, canDelete: false };
}

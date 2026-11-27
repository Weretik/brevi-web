import { validateSewingAccessResponse } from '../../validators/sewing-access/validate-sewing-access-response';

import type { SewingAccess } from '../../models/sewing-access/sewing-access';

export function mapSewingAccess(value: unknown): SewingAccess {
  const { roles } = validateSewingAccessResponse(value);
  return {
    canRead: roles.some((role) => ['Admin', 'Manager', 'User'].includes(role)),
    canManage: roles.some((role) => ['Admin', 'Manager'].includes(role)),
    /** Cost price and supplier price (CAT-019): Admin; the Director also holds Admin. */
    canSeeCost: roles.includes('Admin'),
  };
}

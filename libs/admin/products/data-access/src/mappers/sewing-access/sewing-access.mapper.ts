import { validateSewingAccessResponse } from '../../validators/sewing-access/validate-sewing-access-response';

import type { SewingAccess } from '../../models/sewing-access/sewing-access';

export function mapSewingAccess(value: unknown): SewingAccess {
  const { roles } = validateSewingAccessResponse(value);
  return {
    canRead: roles.some((role) => ['Admin', 'Manager', 'User'].includes(role)),
    canManage: roles.some((role) => ['Admin', 'Manager'].includes(role)),
  };
}

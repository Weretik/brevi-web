import { record } from '../response-validation';
import { ensureSewingResponse } from '../sewing-response-values';

import type { operations } from '@admin/shared/contracts';

type SessionRoles = Pick<
  operations['getCurrentSession']['responses'][200]['content']['application/json'],
  'roles'
>;

export function validateSewingAccessResponse(value: unknown): SessionRoles {
  const item = record(value);
  ensureSewingResponse(
    Array.isArray(item['roles']) && item['roles'].every((role) => typeof role === 'string'),
  );
  return { roles: item['roles'] as string[] };
}

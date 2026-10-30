import type { operations } from '@admin/shared/contracts';

type CurrentSession =
  operations['getCurrentSession']['responses'][200]['content']['application/json'];

/** Navigation uses the server session, never decoded or cached browser token claims. */
export function mapSessionRoles(value: unknown): readonly string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Некоректна відповідь поточної сесії.');
  const roles = (value as Partial<CurrentSession>).roles;
  if (!Array.isArray(roles) || !roles.every((role) => typeof role === 'string'))
    throw new Error('Некоректні ролі поточної сесії.');
  return roles;
}

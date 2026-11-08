import type { components } from '@admin/shared/contracts';
import type { StaffAccount, StaffRole, StaffRoleOption } from '@admin/users/model';

type StaffAccountResponse = components['schemas']['StaffAccountResponse'];

export const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

/** A built-in role or one made on «Права доступу»; the server checks it is known. */
export const isRoleName = (value: unknown): value is StaffRole =>
  typeof value === 'string' && value.trim().length > 0;

const isStaffAccountResponse = (value: unknown): value is StaffAccountResponse => {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<StaffAccountResponse>;
  return (
    typeof row.id === 'number' &&
    typeof row.email === 'string' &&
    typeof row.fullName === 'string' &&
    typeof row.isBlocked === 'boolean' &&
    isNullableString(row.avatarUrl) &&
    isNullableString(row.phoneNumber) &&
    isRoleName(row.role)
  );
};

/** Checks the server response before the page uses it. */
export const mapStaffAccount = (value: unknown): StaffAccount => {
  if (!isStaffAccountResponse(value)) throw new Error('Некоректна відповідь про користувача.');
  return {
    id: value.id,
    email: value.email,
    fullName: value.fullName,
    role: value.role,
    isBlocked: value.isBlocked,
    avatarUrl: value.avatarUrl,
    phoneNumber: value.phoneNumber,
  };
};

export const mapStaffAccounts = (value: unknown): StaffAccount[] => {
  if (!Array.isArray(value)) throw new Error('Некоректний список користувачів.');
  return value.map(mapStaffAccount);
};

const isRoleOption = (value: unknown): value is StaffRoleOption => {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<StaffRoleOption>;
  return isRoleName(row.name) && typeof row.title === 'string' && typeof row.locked === 'boolean';
};

/** Roles from GET /api/admin/access, in the server order, reduced to what the users page needs. */
export const mapStaffRoleOptions = (value: unknown): StaffRoleOption[] => {
  const roles = (value as { roles?: unknown } | null)?.roles;
  if (!Array.isArray(roles)) throw new Error('Некоректний список ролей.');
  return roles.map((role) => {
    if (!isRoleOption(role)) throw new Error('Некоректна роль.');
    return { name: role.name, title: role.title, locked: role.locked };
  });
};

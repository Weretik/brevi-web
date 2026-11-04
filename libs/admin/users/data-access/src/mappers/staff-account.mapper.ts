import { staffRoles } from '@admin/users/model';

import type { components } from '@admin/shared/contracts';
import type { StaffAccount, StaffRole } from '@admin/users/model';

type StaffAccountResponse = components['schemas']['StaffAccountResponse'];

export const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

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
    staffRoles.includes(row.role as StaffRole)
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

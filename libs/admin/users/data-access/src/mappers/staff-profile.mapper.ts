import { isNullableString, isRoleName } from './staff-account.mapper';

import type { components } from '@admin/shared/contracts';
import type { StaffProfile } from '@admin/users/model';

type ProfileResponse = components['schemas']['ProfileResponse'];

const isProfileResponse = (value: unknown): value is ProfileResponse => {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<ProfileResponse>;
  return (
    typeof row.id === 'number' &&
    typeof row.email === 'string' &&
    typeof row.fullName === 'string' &&
    isNullableString(row.avatarUrl) &&
    isNullableString(row.phoneNumber) &&
    isRoleName(row.role)
  );
};

/** Checks the server response before the profile page uses it. */
export const mapStaffProfile = (value: unknown): StaffProfile => {
  if (!isProfileResponse(value)) throw new Error('Некоректна відповідь профілю.');
  return {
    id: value.id,
    email: value.email,
    fullName: value.fullName,
    role: value.role,
    avatarUrl: value.avatarUrl,
    phoneNumber: value.phoneNumber,
  };
};

/** Empty text means "no phone" for the server. */
export const toPhoneBody = (phone: string): string | null => phone.trim() || null;

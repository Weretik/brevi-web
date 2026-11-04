import type { StaffRole } from './staff-account';

/** The signed-in staff member's own profile. */
export interface StaffProfile {
  id: number;
  email: string;
  fullName: string;
  role: StaffRole;
  avatarUrl: string | null;
  phoneNumber: string | null;
}

/**
 * The director and administrators change their own phone, email and password.
 * A manager or an accountant changes only the name and the photo.
 */
export const canChangeOwnCredentials = (profile: Pick<StaffProfile, 'role'>): boolean =>
  profile.role === 'Admin' || profile.role === 'Director';

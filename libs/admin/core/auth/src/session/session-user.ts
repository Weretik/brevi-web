/** The director also holds Admin. */
export type SessionRole = 'Director' | 'Admin' | 'Accountant' | 'Manager' | 'User';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
}

/** Admin works only for staff; a customer account signed in here sees "no access". */
const staffRoles: readonly SessionRole[] = ['Director', 'Admin', 'Accountant', 'Manager'];

export const isStaff = (user: SessionUser): boolean =>
  user.roles.some((role) => staffRoles.includes(role));

export const canManageUsers = (user: SessionUser): boolean => user.roles.includes('Admin');

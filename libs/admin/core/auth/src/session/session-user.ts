export type SessionRole = 'Admin' | 'Manager' | 'User';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
}

/** Admin works only for staff; a customer account signed in here sees "no access". */
export const isStaff = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Manager');

export const canManageUsers = (user: SessionUser): boolean => user.roles.includes('Admin');

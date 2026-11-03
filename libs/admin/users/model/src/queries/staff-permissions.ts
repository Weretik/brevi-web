import { staffRoles } from '../entities/staff-account';

import type { StaffAccount, StaffRole } from '../entities/staff-account';

/** The signed-in staff member who opens the menu. */
export interface StaffActor {
  id: number | null;
  isDirector: boolean;
}

export interface StaffAccountPermissions {
  roleChoices: readonly StaffRole[];
  canSetPassword: boolean;
  canBlock: boolean;
  canDelete: boolean;
}

export const hasDirector = (accounts: readonly StaffAccount[]): boolean =>
  accounts.some((account) => account.role === 'Director');

/**
 * Mirrors the server rules: one director; only the director changes the director;
 * nobody blocks or deletes themselves; only the director changes their own role.
 */
export const getStaffAccountPermissions = (
  account: StaffAccount,
  actor: StaffActor,
  directorExists: boolean,
): StaffAccountPermissions => {
  const isSelf = account.id === actor.id;
  const canChange = account.role !== 'Director' || actor.isDirector;
  const canChangeRole = canChange && (!isSelf || actor.isDirector);

  return {
    roleChoices: canChangeRole
      ? staffRoles.filter(
          (role) => role !== account.role && (role !== 'Director' || !directorExists),
        )
      : [],
    canSetPassword: canChange,
    canBlock: canChange && !isSelf,
    canDelete: canChange && !isSelf,
  };
};

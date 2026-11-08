import { directorRole } from '../entities/staff-account';

import type { StaffAccount, StaffRoleOption } from '../entities/staff-account';

/** The signed-in staff member who opens the menu. */
export interface StaffActor {
  id: number | null;
  isDirector: boolean;
}

export interface StaffAccountPermissions {
  /** Roles this account may be moved to, in the server order. */
  roleChoices: readonly StaffRoleOption[];
  canSetPassword: boolean;
  /** Name, email and phone. */
  canEditDetails: boolean;
  canBlock: boolean;
  canDelete: boolean;
}

export const hasDirector = (accounts: readonly StaffAccount[]): boolean =>
  accounts.some((account) => account.role === directorRole);

/**
 * Mirrors the server rules: one director; only the director changes the director;
 * nobody blocks or deletes themselves; only the director changes their own role.
 */
export const getStaffAccountPermissions = (
  account: StaffAccount,
  actor: StaffActor,
  directorExists: boolean,
  roleOptions: readonly StaffRoleOption[],
): StaffAccountPermissions => {
  const isSelf = account.id === actor.id;
  const canChange = account.role !== directorRole || actor.isDirector;
  const canChangeRole = canChange && (!isSelf || actor.isDirector);

  return {
    roleChoices: canChangeRole
      ? roleOptions.filter(
          (role) => role.name !== account.role && (role.name !== directorRole || !directorExists),
        )
      : [],
    canSetPassword: canChange,
    canEditDetails: canChange,
    canBlock: canChange && !isSelf,
    canDelete: canChange && !isSelf,
  };
};

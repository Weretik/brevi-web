import { describe, expect, it } from 'vitest';

import { getStaffAccountPermissions } from './staff-permissions';

import type { StaffAccount, StaffRoleOption } from '../entities/staff-account';

const account = (id: number, role: StaffAccount['role']): StaffAccount => ({
  id,
  email: `${id}@brevi.test`,
  fullName: '',
  role,
  isBlocked: false,
  avatarUrl: null,
  phoneNumber: null,
});

const admin = { id: 1, isDirector: false };
const director = { id: 2, isDirector: true };

const roles: StaffRoleOption[] = [
  { name: 'Director', title: 'Директор', locked: true },
  { name: 'Admin', title: 'Адміністратор', locked: false },
  { name: 'Manager', title: 'Менеджер', locked: false },
  { name: 'custom-0123456789ab', title: 'Склад', locked: false },
];

const names = (choices: readonly StaffRoleOption[]) => choices.map((role) => role.name);

describe('getStaffAccountPermissions', () => {
  it('lets an admin change a manager but not make a second director', () => {
    const permissions = getStaffAccountPermissions(account(3, 'Manager'), admin, true, roles);

    expect(names(permissions.roleChoices)).toEqual(['Admin', 'custom-0123456789ab']);
    expect(permissions.canBlock && permissions.canDelete && permissions.canSetPassword).toBe(true);
  });

  it('offers Director while there is none', () => {
    expect(
      names(getStaffAccountPermissions(account(3, 'Manager'), admin, false, roles).roleChoices),
    ).toContain('Director');
  });

  it('moves an account with a custom role back to a built-in one', () => {
    const permissions = getStaffAccountPermissions(
      account(3, 'custom-0123456789ab'),
      admin,
      true,
      roles,
    );

    expect(names(permissions.roleChoices)).toEqual(['Admin', 'Manager']);
  });

  it('does not let an admin change the director', () => {
    expect(getStaffAccountPermissions(account(2, 'Director'), admin, true, roles)).toEqual({
      roleChoices: [],
      canSetPassword: false,
      canEditDetails: false,
      canBlock: false,
      canDelete: false,
    });
  });

  it('lets the director change their own role and password but not block or delete themselves', () => {
    const permissions = getStaffAccountPermissions(account(2, 'Director'), director, true, roles);

    expect(names(permissions.roleChoices)).toEqual(['Admin', 'Manager', 'custom-0123456789ab']);
    expect(permissions.canSetPassword).toBe(true);
    expect(permissions.canBlock || permissions.canDelete).toBe(false);
  });

  it('does not let an admin change their own role', () => {
    expect(getStaffAccountPermissions(account(1, 'Admin'), admin, true, roles).roleChoices).toEqual(
      [],
    );
  });
});

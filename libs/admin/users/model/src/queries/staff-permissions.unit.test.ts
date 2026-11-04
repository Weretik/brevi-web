import { describe, expect, it } from 'vitest';

import { getStaffAccountPermissions } from './staff-permissions';

import type { StaffAccount } from '../entities/staff-account';

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

describe('getStaffAccountPermissions', () => {
  it('lets an admin change a manager but not make a second director', () => {
    const permissions = getStaffAccountPermissions(account(3, 'Manager'), admin, true);

    expect(permissions.roleChoices).toEqual(['Accountant', 'Admin']);
    expect(permissions.canBlock && permissions.canDelete && permissions.canSetPassword).toBe(true);
  });

  it('offers Director while there is none', () => {
    expect(getStaffAccountPermissions(account(3, 'Manager'), admin, false).roleChoices).toContain(
      'Director',
    );
  });

  it('does not let an admin change the director', () => {
    expect(getStaffAccountPermissions(account(2, 'Director'), admin, true)).toEqual({
      roleChoices: [],
      canSetPassword: false,
      canEditDetails: false,
      canBlock: false,
      canDelete: false,
    });
  });

  it('lets the director change their own role and password but not block or delete themselves', () => {
    const permissions = getStaffAccountPermissions(account(2, 'Director'), director, true);

    expect(permissions.roleChoices).toEqual(['Manager', 'Accountant', 'Admin']);
    expect(permissions.canSetPassword).toBe(true);
    expect(permissions.canBlock || permissions.canDelete).toBe(false);
  });

  it('does not let an admin change their own role', () => {
    expect(getStaffAccountPermissions(account(1, 'Admin'), admin, true).roleChoices).toEqual([]);
  });
});

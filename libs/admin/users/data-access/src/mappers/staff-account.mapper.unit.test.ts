import { describe, expect, it } from 'vitest';

import { mapStaffAccount, mapStaffAccounts, mapStaffRoleOptions } from './staff-account.mapper';

const row = {
  id: 3,
  email: 'm@brevi.com.ua',
  fullName: 'Олена',
  role: 'Manager',
  isBlocked: false,
  avatarUrl: 'https://cdn.brevi.test/avatars/3/a.webp',
  phoneNumber: null,
};

describe('staff account mapper', () => {
  it('maps the server account', () => {
    expect(mapStaffAccounts([row])).toEqual([row]);
  });

  it('accepts a role made on «Права доступу»', () => {
    expect(mapStaffAccount({ ...row, role: 'custom-0123456789ab' }).role).toBe(
      'custom-0123456789ab',
    );
  });

  it('rejects an empty role or a missing field', () => {
    expect(() => mapStaffAccount({ ...row, role: '' })).toThrow();
    expect(() => mapStaffAccount({ ...row, role: 3 })).toThrow();
    expect(() => mapStaffAccount({ ...row, id: '3' })).toThrow();
    expect(() => mapStaffAccounts(null)).toThrow();
  });

  it('maps the roles of «Права доступу» to options', () => {
    expect(
      mapStaffRoleOptions({
        areas: [],
        roles: [
          { name: 'Director', title: 'Директор', locked: true, builtIn: true, userCount: 1 },
          { name: 'custom-0123456789ab', title: 'Склад', locked: false, builtIn: false },
        ],
      }),
    ).toEqual([
      { name: 'Director', title: 'Директор', locked: true },
      { name: 'custom-0123456789ab', title: 'Склад', locked: false },
    ]);
    expect(() => mapStaffRoleOptions({ roles: [{ name: 'Admin' }] })).toThrow();
    expect(() => mapStaffRoleOptions(null)).toThrow();
  });
});

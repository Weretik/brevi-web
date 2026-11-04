import { describe, expect, it } from 'vitest';

import { mapStaffAccount, mapStaffAccounts } from './staff-account.mapper';

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

  it('rejects an unknown role or a missing field', () => {
    expect(() => mapStaffAccount({ ...row, role: 'User' })).toThrow();
    expect(() => mapStaffAccount({ ...row, id: '3' })).toThrow();
    expect(() => mapStaffAccounts(null)).toThrow();
  });
});

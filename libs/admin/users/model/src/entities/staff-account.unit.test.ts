import { describe, expect, it } from 'vitest';

import { getStaffRoleTitle } from './staff-account';

describe('getStaffRoleTitle', () => {
  it('prefers the server title, then the built-in label, then the name', () => {
    const options = [{ name: 'custom-0123456789ab', title: 'Склад', locked: false }];

    expect(getStaffRoleTitle('custom-0123456789ab', options)).toBe('Склад');
    expect(getStaffRoleTitle('Manager')).toBe('Менеджер');
    expect(getStaffRoleTitle('custom-ffffffffffff', options)).toBe('custom-ffffffffffff');
  });
});

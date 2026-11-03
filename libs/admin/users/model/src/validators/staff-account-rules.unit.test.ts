import { describe, expect, it } from 'vitest';

import { validateStaffAccountInput, validateStaffPassword } from './staff-account-rules';

describe('staff account rules', () => {
  it('accepts a complete account', () => {
    expect(
      validateStaffAccountInput({
        email: 'm@brevi.com.ua',
        fullName: 'Олена',
        role: 'Manager',
        password: '12345678',
      }),
    ).toEqual({});
  });

  it('reports every invalid field', () => {
    const errors = validateStaffAccountInput({
      email: 'not-email',
      fullName: ' ',
      role: 'Admin',
      password: 'short',
    });

    expect(Object.keys(errors).sort()).toEqual(['email', 'fullName', 'password']);
  });

  it('requires at least 8 password characters', () => {
    expect(validateStaffPassword('1234567')).toBeDefined();
    expect(validateStaffPassword('12345678')).toBeUndefined();
  });
});

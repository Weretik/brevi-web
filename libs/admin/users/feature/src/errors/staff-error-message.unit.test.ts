import { describe, expect, it } from 'vitest';

import { getStaffErrorMessage } from './staff-error-message';

describe('getStaffErrorMessage', () => {
  it('explains a duplicate email', () => {
    expect(getStaffErrorMessage({ code: 'Unknown', status: 409, message: 'Conflict' })).toBe(
      'Користувач з таким email вже існує.',
    );
  });

  it('explains the director rules', () => {
    expect(
      getStaffErrorMessage({
        code: 'Unknown',
        status: 409,
        message: 'There can be only one director.',
      }),
    ).toBe('Директор може бути лише один.');
    expect(
      getStaffErrorMessage({
        code: 'Forbidden',
        status: 403,
        message: 'Only the director can change the director.',
      }),
    ).toBe('Директора може змінювати лише директор.');
  });

  it('lists server validation messages', () => {
    expect(
      getStaffErrorMessage({
        code: 'Validation',
        status: 400,
        message: 'x',
        fieldErrors: { password: ['Too short.'] },
      }),
    ).toBe('Перевірте дані: Too short.');
  });

  it('falls back for unknown errors', () => {
    expect(getStaffErrorMessage(new Error('boom'))).toBe(
      'Не вдалося виконати дію. Спробуйте ще раз.',
    );
  });
});

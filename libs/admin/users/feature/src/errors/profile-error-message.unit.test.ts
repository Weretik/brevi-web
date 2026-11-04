import { describe, expect, it } from 'vitest';

import { getProfileErrorMessage } from './profile-error-message';

const apiError = (status: number, fieldErrors: Record<string, string> = {}) => ({
  code: Object.keys(fieldErrors).length > 0 ? 'Validation' : 'Unknown',
  status,
  message: '',
  fieldErrors,
});

describe('profile error message', () => {
  it('names a wrong current password', () => {
    expect(getProfileErrorMessage(apiError(400, { currentPassword: 'wrong' }))).toBe(
      'Поточний пароль неправильний.',
    );
  });

  it('explains photo upload failures', () => {
    expect(getProfileErrorMessage(apiError(413))).toMatch(/2 МБ/);
    expect(getProfileErrorMessage(apiError(503))).toMatch(/Сховище фото/);
    expect(getProfileErrorMessage(apiError(400, { file: 'bad' }))).toMatch(/128×128/);
  });
});

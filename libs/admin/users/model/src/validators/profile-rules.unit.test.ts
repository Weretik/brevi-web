import { describe, expect, it } from 'vitest';

import { validateAvatarDimensions, validateAvatarFile } from './avatar-file-rules';
import { validatePhoneNumber, validateStaffDetails } from './profile-rules';

describe('profile rules', () => {
  it('accepts an empty phone and common phone formats', () => {
    expect(validatePhoneNumber('')).toBeUndefined();
    expect(validatePhoneNumber('+38 (050) 123-45-67')).toBeUndefined();
  });

  it('rejects letters, a plus in the middle and too few digits', () => {
    expect(validatePhoneNumber('050abc4567')).toBeDefined();
    expect(validatePhoneNumber('050+1234567')).toBeDefined();
    expect(validatePhoneNumber('12345')).toBeDefined();
  });

  it('collects only the fields with errors', () => {
    expect(
      validateStaffDetails({ fullName: ' ', email: 'ok@brevi.test', phoneNumber: '' }),
    ).toEqual({ fullName: 'Вкажіть імʼя.' });
  });

  it('checks the photo type, size and dimensions', () => {
    expect(validateAvatarFile({ type: 'image/gif', size: 10 })).toBeDefined();
    expect(validateAvatarFile({ type: 'image/png', size: 3 * 1024 * 1024 })).toBeDefined();
    expect(validateAvatarFile({ type: 'image/webp', size: 1000 })).toBeUndefined();
    expect(validateAvatarDimensions({ width: 100, height: 400 })).toBeDefined();
    expect(validateAvatarDimensions({ width: 128, height: 128 })).toBeUndefined();
  });
});

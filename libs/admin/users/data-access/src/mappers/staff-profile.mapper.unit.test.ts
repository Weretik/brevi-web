import { describe, expect, it } from 'vitest';

import { mapStaffProfile, toPhoneBody } from './staff-profile.mapper';

const profile = {
  id: 4,
  email: 'b@brevi.com.ua',
  fullName: 'Ірина',
  role: 'Accountant',
  avatarUrl: null,
  phoneNumber: '+380501234567',
};

describe('staff profile mapper', () => {
  it('maps the server profile', () => {
    expect(mapStaffProfile(profile)).toEqual(profile);
  });

  it('rejects a missing photo field or an empty role', () => {
    expect(() => mapStaffProfile({ ...profile, avatarUrl: undefined })).toThrow();
    expect(() => mapStaffProfile({ ...profile, role: '' })).toThrow();
    expect(mapStaffProfile({ ...profile, role: 'custom-0123456789ab' }).role).toBe(
      'custom-0123456789ab',
    );
  });

  it('sends an empty phone as null', () => {
    expect(toPhoneBody('  ')).toBeNull();
    expect(toPhoneBody(' 050 123 ')).toBe('050 123');
  });
});

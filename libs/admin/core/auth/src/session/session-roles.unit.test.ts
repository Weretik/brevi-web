import { describe, expect, it } from 'vitest';

import { mapSessionRoles } from './session-roles';

describe('current session roles', () => {
  it('uses exact server role names for navigation', () => {
    expect(mapSessionRoles({ roles: ['Admin', 'Manager'] })).toEqual(['Admin', 'Manager']);
    expect(mapSessionRoles({ roles: ['Manager'] })).toEqual(['Manager']);
  });
  it('rejects malformed roles rather than granting access', () => {
    expect(() => mapSessionRoles({ roles: 'Admin' })).toThrow();
    expect(() => mapSessionRoles(null)).toThrow();
  });
});

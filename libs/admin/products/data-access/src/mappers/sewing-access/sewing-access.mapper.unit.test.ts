import { describe, expect, it } from 'vitest';

import { mapSewingAccess } from './sewing-access.mapper';

describe('Sewing access response mapping', () => {
  it('uses server roles to distinguish product managers and readers', () => {
    expect(mapSewingAccess({ roles: ['User'] })).toEqual({ canRead: true, canManage: false });
    expect(mapSewingAccess({ roles: ['Manager'] })).toEqual({ canRead: true, canManage: true });
    expect(() => mapSewingAccess({ roles: 'Admin' })).toThrow();
  });
});

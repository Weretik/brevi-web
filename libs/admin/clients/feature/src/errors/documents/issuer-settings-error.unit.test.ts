import { describe, expect, it } from 'vitest';

import { issuerSettingsError } from './issuer-settings-error';

describe('issuer settings errors', () => {
  it('explains Admin-only 403', () => {
    expect(
      issuerSettingsError({ status: 403, code: 'Forbidden', message: 'Denied', fieldErrors: {} }),
    ).toContain('Лише адміністратор');
  });
  it('asks to reload after a version conflict', () => {
    expect(
      issuerSettingsError({ status: 409, code: 'Conflict', message: 'Conflict', fieldErrors: {} }),
    ).toContain('Оновіть сторінку');
  });
});

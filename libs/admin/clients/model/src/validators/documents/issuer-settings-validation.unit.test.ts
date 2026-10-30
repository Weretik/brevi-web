import { describe, expect, it } from 'vitest';

import { issuerSettingsErrors } from './issuer-settings-validation';
import { emptyIssuerSettingsDraft } from '../../models/documents/issuer-settings-draft';

const complete = () => ({
  ...emptyIssuerSettingsDraft(),
  legalName: 'ТОВ «Бреві»',
  edrpou: '12345678',
  taxId: '1234567890',
  iban: 'UA123456789012345678901234567',
  address: 'Київ',
  phone: '+380501234567',
  email: 'office@example.com',
  site: 'https://brevi.example',
});

describe('seller settings form rules', () => {
  it('requires verified seller details while leaving bank name and MFO optional', () => {
    expect(issuerSettingsErrors(emptyIssuerSettingsDraft())).toHaveProperty('legalName');
    expect(issuerSettingsErrors(complete())).toEqual({});
  });

  it('matches the backend HTTPS and allowlisted logo policy', () => {
    expect(issuerSettingsErrors({ ...complete(), site: 'http://brevi.example' })).toHaveProperty(
      'site',
    );
    expect(issuerSettingsErrors({ ...complete(), logoAssetKey: 'brevi-wordmark' })).toEqual({});
    expect(
      issuerSettingsErrors({
        ...complete(),
        logoAssetKey: 'https://other.example/logo.svg' as 'brevi-wordmark',
      }),
    ).toHaveProperty('logoAssetKey');
  });

  it('enforces canonical length limits on optional and required fields', () => {
    expect(issuerSettingsErrors({ ...complete(), bankName: 'x'.repeat(201) })).toHaveProperty(
      'bankName',
    );
    expect(issuerSettingsErrors({ ...complete(), legalName: 'x'.repeat(201) })).toHaveProperty(
      'legalName',
    );
  });
});

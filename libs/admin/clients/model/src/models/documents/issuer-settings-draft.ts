/** Editable seller values. This is form state, not a generated transport DTO. */
export interface IssuerSettingsDraft {
  legalName: string;
  edrpou: string;
  taxId: string;
  iban: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  bankName: string;
  mfo: string;
  logoAssetKey: '' | 'brevi-wordmark';
}

export const emptyIssuerSettingsDraft = (): IssuerSettingsDraft => ({
  legalName: '',
  edrpou: '',
  taxId: '',
  iban: '',
  address: '',
  phone: '',
  email: '',
  site: '',
  bankName: '',
  mfo: '',
  logoAssetKey: '',
});

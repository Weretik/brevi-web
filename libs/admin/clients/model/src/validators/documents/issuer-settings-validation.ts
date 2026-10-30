import type { IssuerSettingsDraft } from '../../models/documents/issuer-settings-draft';

const required: readonly (readonly [keyof IssuerSettingsDraft, number, string])[] = [
  ['legalName', 200, 'юридичну назву'],
  ['edrpou', 50, 'код ЄДРПОУ'],
  ['taxId', 50, 'податковий номер'],
  ['iban', 80, 'IBAN'],
  ['address', 500, 'адресу'],
  ['phone', 80, 'телефон'],
  ['email', 200, 'email'],
  ['site', 500, 'сайт'],
];

export function issuerSettingsErrors(
  value: IssuerSettingsDraft,
): Partial<Record<keyof IssuerSettingsDraft, string>> {
  const errors: Partial<Record<keyof IssuerSettingsDraft, string>> = {};
  for (const [field, max, label] of required) {
    if (!value[field].trim()) errors[field] = `Вкажіть ${label}.`;
    else if (value[field].trim().length > max) errors[field] = `Максимум ${max} символів.`;
  }
  for (const [field, max] of [
    ['bankName', 200],
    ['mfo', 20],
  ] as const) {
    if (value[field].trim().length > max) errors[field] = `Максимум ${max} символів.`;
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()))
    errors.email = 'Вкажіть коректний email.';
  if (!errors.site) {
    try {
      if (new URL(value.site.trim()).protocol !== 'https:')
        errors.site = 'Вкажіть HTTPS-адресу сайту.';
    } catch {
      errors.site = 'Вкажіть коректну HTTPS-адресу сайту.';
    }
  }
  if (value.logoAssetKey !== '' && value.logoAssetKey !== 'brevi-wordmark')
    errors.logoAssetKey = 'Оберіть доступний логотип.';
  return errors;
}

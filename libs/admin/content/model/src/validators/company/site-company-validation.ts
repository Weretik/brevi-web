import type {
  CompanyManager,
  CompanyText,
  SiteCompany,
  SiteCompanyInput,
} from '../../entities/company/site-company';

/** A manager as the form edits it: phones as one line, separated by commas. */
export interface CompanyManagerFormValues {
  name: CompanyText;
  photoUrl: string | null;
  phones: string;
  email: string;
}

export interface SiteCompanyFormValues {
  phone: string;
  email: string;
  city: CompanyText;
  street: CompanyText;
  mapQuery: string;
  days: number[];
  opens: string;
  closes: string;
  managers: CompanyManagerFormValues[];
  recipient: CompanyText;
  edrpou: string;
  iban: string;
  bank: CompanyText;
  instagram: string;
  youtube: string;
  facebook: string;
}

/** Field → Ukrainian reason; a manager field is keyed `managers.<index>.<field>`. */
export type SiteCompanyErrors = Partial<Record<string, string>>;

export const companyLimits = { text: 200, email: 120, managers: 10, managerPhones: 3 } as const;

const time = /^([01]\d|2[0-3]):[0-5]\d$/;
const email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** A Ukrainian number in any common form as the site shows it, `050 469 86 75`; null for anything else. */
export function formatPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('380')) digits = digits.slice(2);
  if (digits.length !== 10 || !digits.startsWith('0')) return null;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}

export function splitPhones(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

const isHttps = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

export function siteCompanyFormOf(company: SiteCompany): SiteCompanyFormValues {
  return {
    phone: company.phone,
    email: company.email,
    city: { ...company.city },
    street: { ...company.street },
    mapQuery: company.mapQuery,
    days: [...company.schedule.days],
    opens: company.schedule.opens,
    closes: company.schedule.closes,
    managers: company.managers.map((m) => ({
      name: { ...m.name },
      photoUrl: m.photoUrl,
      phones: m.phones.join(', '),
      email: m.email ?? '',
    })),
    recipient: { ...company.bankDetails.recipient },
    edrpou: company.bankDetails.edrpou,
    iban: company.bankDetails.iban,
    bank: { ...company.bankDetails.bank },
    instagram: company.socials.instagram ?? '',
    youtube: company.socials.youtube ?? '',
    facebook: company.socials.facebook ?? '',
  };
}

export const emptyManager = (): CompanyManagerFormValues => ({
  name: { uk: '', ru: '' },
  photoUrl: null,
  phones: '',
  email: '',
});

export function validateSiteCompany(values: SiteCompanyFormValues): SiteCompanyErrors {
  const errors: SiteCompanyErrors = {};
  const both = (key: string, text: CompanyText) => {
    if (!text.uk.trim() || !text.ru.trim()) errors[key] = 'Заповніть українською й російською.';
    else if (text.uk.length > companyLimits.text || text.ru.length > companyLimits.text)
      errors[key] = 'Не більше 200 символів.';
  };
  if (!formatPhone(values.phone)) errors['phone'] = 'Український номер, наприклад 050 469 86 75.';
  if (!email.test(values.email.trim())) errors['email'] = 'Адреса виду name@example.com.';
  both('city', values.city);
  both('street', values.street);
  if (!values.mapQuery.trim()) errors['mapQuery'] = 'Що шукати на мапі, наприклад адреса.';
  if (values.days.length === 0) errors['days'] = 'Оберіть хоча б один робочий день.';
  if (!time.test(values.opens) || !time.test(values.closes) || values.opens >= values.closes)
    errors['hours'] = 'Час виду 09:00; кінець пізніше за початок.';
  if (values.managers.length > companyLimits.managers)
    errors['managers'] = 'Не більше 10 менеджерів.';
  values.managers.forEach((manager, index) => {
    const key = `managers.${index}`;
    both(`${key}.name`, manager.name);
    const phones = splitPhones(manager.phones);
    if (phones.length < 1 || phones.length > companyLimits.managerPhones)
      errors[`${key}.phones`] = 'Від одного до трьох телефонів через кому.';
    else if (phones.some((p) => !formatPhone(p)))
      errors[`${key}.phones`] = 'Українські номери, наприклад 050 309 06 60.';
    if (manager.email.trim() && !email.test(manager.email.trim()))
      errors[`${key}.email`] = 'Адреса виду name@example.com.';
  });
  both('recipient', values.recipient);
  both('bank', values.bank);
  if (!/^\d{8}(\d{2})?$/.test(values.edrpou.trim()))
    errors['edrpou'] = '8 цифр (або 10 цифр для ФОП).';
  if (!/^UA\d{27}$/.test(values.iban.replace(/\s/g, '').toUpperCase()))
    errors['iban'] = 'UA і 27 цифр.';
  for (const key of ['instagram', 'youtube', 'facebook'] as const) {
    const link = values[key].trim();
    if (link && !isHttps(link)) errors[key] = 'Повна адреса, що починається з https://.';
  }
  return errors;
}

export function siteCompanyInputOf(
  revision: number,
  values: SiteCompanyFormValues,
): SiteCompanyInput {
  const link = (value: string) => value.trim() || null;
  const managers: CompanyManager[] = values.managers.map((m) => ({
    name: { uk: m.name.uk.trim(), ru: m.name.ru.trim() },
    photoUrl: m.photoUrl,
    phones: splitPhones(m.phones).map((p) => formatPhone(p) ?? p),
    email: m.email.trim() || null,
  }));
  return {
    revision,
    phone: formatPhone(values.phone) ?? values.phone,
    email: values.email.trim(),
    city: values.city,
    street: values.street,
    mapQuery: values.mapQuery.trim(),
    schedule: {
      days: [...values.days].sort((a, b) => a - b),
      opens: values.opens,
      closes: values.closes,
    },
    managers,
    bankDetails: {
      recipient: values.recipient,
      edrpou: values.edrpou.trim(),
      iban: values.iban,
      bank: values.bank,
    },
    socials: {
      instagram: link(values.instagram),
      youtube: link(values.youtube),
      facebook: link(values.facebook),
    },
  };
}

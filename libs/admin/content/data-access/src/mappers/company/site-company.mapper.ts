import {
  integer,
  list,
  nullableDateTime,
  nullableText,
  record,
  text,
} from '../../validators/content-response';

import type {
  CompanyBankDetails,
  CompanyManager,
  CompanyText,
  SiteCompany,
} from '@admin/content/model';

function mapText(value: unknown, name: string): CompanyText {
  const texts = record(value, name);
  return { uk: text(texts['uk'], name), ru: text(texts['ru'], name) };
}

function mapManager(value: unknown): CompanyManager {
  const manager = record(value, 'менеджер');
  return {
    name: mapText(manager['name'], 'імʼя'),
    photoUrl: nullableText(manager['photoUrl'], 'фото'),
    phones: list(manager['phones'], 'телефони').map((x) => text(x, 'телефон')),
    email: nullableText(manager['email'], 'пошта'),
  };
}

function mapBank(value: unknown): CompanyBankDetails {
  const bank = record(value, 'реквізити');
  return {
    recipient: mapText(bank['recipient'], 'отримувач'),
    edrpou: text(bank['edrpou'], 'ЄДРПОУ'),
    iban: text(bank['iban'], 'IBAN'),
    bank: mapText(bank['bank'], 'банк'),
  };
}

export function mapSiteCompany(value: unknown): SiteCompany {
  const company = record(value, 'контакти компанії');
  const schedule = record(company['schedule'], 'графік');
  const socials = record(company['socials'], 'соцмережі');
  return {
    phone: text(company['phone'], 'телефон'),
    email: text(company['email'], 'пошта'),
    city: mapText(company['city'], 'місто'),
    street: mapText(company['street'], 'вулиця'),
    mapQuery: text(company['mapQuery'], 'мапа'),
    schedule: {
      days: list(schedule['days'], 'дні').map((x) => integer(x, 'день', 1)),
      opens: text(schedule['opens'], 'початок'),
      closes: text(schedule['closes'], 'кінець'),
    },
    managers: list(company['managers'], 'менеджери').map(mapManager),
    bankDetails: mapBank(company['bankDetails']),
    socials: {
      instagram: nullableText(socials['instagram'], 'Instagram'),
      youtube: nullableText(socials['youtube'], 'YouTube'),
      facebook: nullableText(socials['facebook'], 'Facebook'),
    },
    revision: integer(company['revision'], 'версія'),
    updatedAtUtc: nullableDateTime(company['updatedAtUtc'], 'час зміни'),
    updatedBy: nullableText(company['updatedBy'], 'хто змінив'),
  };
}

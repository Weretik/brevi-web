import { COMPANY } from '@site/core/config';
import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import type { Company, CompanyPhone, CompanySocial, Localized } from '@site/core/config';

/** One tag for the company facts, so a «refresh the site» call can drop them. */
export const SITE_COMPANY_CACHE_TAG = 'site-company';

/** A change in the Admin reaches the site within about five minutes. */
const COMPANY_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };

const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_LABELS: Record<keyof Localized, readonly string[]> = {
  uk: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
};

type Raw = Record<string, unknown>;

function object(value: unknown, name: string): Raw {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`Unexpected ${name}.`);
  return value as Raw;
}

function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Unexpected ${name}.`);
  return value;
}

function text(value: unknown, name: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Unexpected ${name}.`);
  return value.trim();
}

function optional(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function localized(value: unknown, name: string): Localized {
  const raw = object(value, name);
  return { uk: text(raw['uk'], name), ru: text(raw['ru'], name) };
}

function phone(value: unknown): CompanyPhone {
  const raw = object(value, 'phone');
  const e164 = text(raw['e164'], 'phone');
  if (!/^\+\d{10,15}$/.test(e164)) throw new Error('Unexpected phone.');
  return { e164, display: text(raw['display'], 'phone') };
}

/** Only an https picture of the library or a picture of the site itself. */
function photo(value: unknown): string | null {
  const url = optional(value);
  return url && (/^https:\/\//.test(url) || url.startsWith('/assets/')) ? url : null;
}

function link(value: unknown): string | null {
  const url = optional(value);
  return url && /^https:\/\//.test(url) ? url : null;
}

/** «Пн–Пт 9:00–18:00» for the given day numbers (Monday = 1). */
export function hoursLabel(
  days: readonly number[],
  opens: string,
  closes: string,
  language: keyof Localized,
): string {
  const names = DAY_LABELS[language];
  const sorted = [...days].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  sorted.forEach((day, i) => {
    const next = sorted[i + 1];
    if (next === day + 1) return;
    ranges.push(start === day ? names[day - 1] : `${names[start - 1]}–${names[day - 1]}`);
    start = next;
  });
  const time = (value: string) => value.replace(/^0(\d)/, '$1');
  return `${ranges.join(', ')} ${time(opens)}–${time(closes)}`;
}

/** The company of the API answer; the name and the logo stay the site's own. Throws on another shape. */
export function mapSiteCompany(data: unknown): Company {
  const raw = object(data, 'company');
  const schedule = object(raw['schedule'], 'schedule');
  const days = array(schedule['days'], 'days').map((day) => {
    if (typeof day !== 'number' || !Number.isInteger(day) || day < 1 || day > 7)
      throw new Error('Unexpected day.');
    return day;
  });
  if (days.length === 0) throw new Error('Unexpected days.');
  const opens = text(schedule['opens'], 'opens');
  const closes = text(schedule['closes'], 'closes');
  const bank = object(raw['bankDetails'], 'bank details');
  const socials = object(raw['socials'], 'socials');
  const socialUrls: Record<CompanySocial['key'], string | null> = {
    instagram: link(socials['instagram']),
    youtube: link(socials['youtube']),
    facebook: link(socials['facebook']),
  };

  return {
    name: COMPANY.name,
    logo: COMPANY.logo,
    email: text(raw['email'], 'email'),
    phones: [phone(raw['phone'])],
    address: {
      countryCode: COMPANY.address.countryCode,
      city: localized(raw['city'], 'city'),
      street: localized(raw['street'], 'street'),
    },
    openingHours: {
      days: [...new Set(days)].sort((a, b) => a - b).map((day) => SCHEMA_DAYS[day - 1]),
      opens,
      closes,
      label: {
        uk: hoursLabel(days, opens, closes, 'uk'),
        ru: hoursLabel(days, opens, closes, 'ru'),
      },
    },
    managers: array(raw['managers'], 'managers').map((value) => {
      const manager = object(value, 'manager');
      return {
        name: localized(manager['name'], 'manager name'),
        photo: photo(manager['photoUrl']),
        phones: array(manager['phones'], 'manager phones').map(phone),
        email: optional(manager['email']),
      };
    }),
    mapQuery: text(raw['mapQuery'], 'map query'),
    bankDetails: {
      recipient: localized(bank['recipient'], 'recipient'),
      edrpou: text(bank['edrpou'], 'edrpou'),
      iban: text(bank['iban'], 'iban'),
      bank: localized(bank['bank'], 'bank'),
    },
    socials: COMPANY.socials.map((social) => ({ ...social, url: socialUrls[social.key] })),
  };
}

/** The company facts of «Контент → Контакти та компанія»; the site's own when the API has none (kept a minute). */
export async function loadSiteCompany(): Promise<Company> {
  'use cache';
  cacheTag(SITE_COMPANY_CACHE_TAG);

  const result = await siteApiGet('/api/public/company');
  if (result.kind === 'ok') {
    try {
      const company = mapSiteCompany(result.data);
      cacheLife(COMPANY_LIFE);
      return company;
    } catch {
      // Falls through to the short life below.
    }
  }
  cacheLife(FAILURE_LIFE);
  return COMPANY;
}

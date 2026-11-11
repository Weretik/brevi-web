import type { ContentLanguage } from '../product-pages/content-product';

/** A text in Ukrainian and Russian. */
export type CompanyText = Record<ContentLanguage, string>;

/** A client manager of the «Контакти» page. */
export interface CompanyManager {
  name: CompanyText;
  /** A picture of the «Фото» library, or a picture of the site itself (`/assets/…`); null without a photo. */
  photoUrl: string | null;
  /** As the site shows them, `050 309 06 60`. */
  phones: string[];
  email: string | null;
}

export interface CompanySchedule {
  /** Monday = 1 … Sunday = 7. */
  days: number[];
  /** `HH:mm`. */
  opens: string;
  closes: string;
}

export interface CompanyBankDetails {
  recipient: CompanyText;
  edrpou: string;
  iban: string;
  bank: CompanyText;
}

export interface CompanySocials {
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
}

/** «Контент → Контакти та компанія»: what the site shows about the company. */
export interface SiteCompany {
  /** The company phone of the header, `050 469 86 75`. */
  phone: string;
  email: string;
  city: CompanyText;
  street: CompanyText;
  /** What the map link and the embedded map look for. */
  mapQuery: string;
  schedule: CompanySchedule;
  managers: CompanyManager[];
  bankDetails: CompanyBankDetails;
  socials: CompanySocials;
  revision: number;
  updatedAtUtc: string | null;
  updatedBy: string | null;
}

export type SiteCompanyInput = Omit<SiteCompany, 'updatedAtUtc' | 'updatedBy'>;

/** What the signed-in staff member may do on «Контакти та компанія» (page `content-company`). */
export interface SiteCompanyViewer {
  canEdit: boolean;
}

/** Short Ukrainian day names, Monday first. */
export const weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'] as const;

/** «Пн–Пт 9:00–18:00»: the schedule as the site shows it. */
export function scheduleText(schedule: CompanySchedule): string {
  const days = [...schedule.days].sort((a, b) => a - b);
  const label = (day: number) => weekDayLabels[day - 1] ?? '';
  const ranges: string[] = [];
  let start = days[0];
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const next = days[i + 1];
    if (next === day + 1) continue;
    ranges.push(start === day ? label(day) : `${label(start)}–${label(day)}`);
    start = next;
  }
  const time = (value: string) => value.replace(/^0(\d)/, '$1');
  return `${ranges.join(', ')} ${time(schedule.opens)}–${time(schedule.closes)}`.trim();
}

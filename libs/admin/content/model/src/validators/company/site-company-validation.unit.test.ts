import { describe, expect, it } from 'vitest';

import {
  emptyManager,
  formatPhone,
  siteCompanyFormOf,
  siteCompanyInputOf,
  validateSiteCompany,
} from './site-company-validation';
import { scheduleText } from '../../entities/company/site-company';

import type { SiteCompany } from '../../entities/company/site-company';

const company: SiteCompany = {
  phone: '050 469 86 75',
  email: 'pp.brevi@gmail.com',
  city: { uk: 'Полтава', ru: 'Полтава' },
  street: { uk: 'вул. Кагамлика, 3А', ru: 'ул. Кагамлыка, 3А' },
  mapQuery: 'Полтава, вулиця Кагамлика, 3А',
  schedule: { days: [1, 2, 3, 4, 5], opens: '09:00', closes: '18:00' },
  managers: [
    {
      name: { uk: 'Вадим', ru: 'Вадим' },
      photoUrl: null,
      phones: ['050 346 75 46'],
      email: null,
    },
  ],
  bankDetails: {
    recipient: { uk: 'ПП «Бреві»', ru: 'ЧП «Бреви»' },
    edrpou: '35521636',
    iban: 'UA63 305299 00000 26004041206862',
    bank: { uk: 'ПриватБанк', ru: 'ПриватБанк' },
  },
  socials: { instagram: null, youtube: null, facebook: null },
  revision: 1,
  updatedAtUtc: null,
  updatedBy: null,
};

describe('site company form', () => {
  it('accepts the saved facts and gives them back as typed numbers', () => {
    const values = siteCompanyFormOf(company);
    values.managers[0].phones = '+380503467546, (067) 446-75-46';
    expect(validateSiteCompany(values)).toEqual({});
    expect(siteCompanyInputOf(1, values).managers[0].phones).toEqual([
      '050 346 75 46',
      '067 446 75 46',
    ]);
  });

  it('names each wrong field', () => {
    const values = siteCompanyFormOf(company);
    values.phone = '12345';
    values.iban = 'UA12';
    values.instagram = 'instagram.com/brevi';
    values.opens = '18:00';
    values.managers.push(emptyManager());
    expect(Object.keys(validateSiteCompany(values)).sort()).toEqual([
      'hours',
      'iban',
      'instagram',
      'managers.1.name',
      'managers.1.phones',
      'phone',
    ]);
  });

  it('formats numbers and the schedule as the site shows them', () => {
    expect(formatPhone('+38 (050) 469-86-75')).toBe('050 469 86 75');
    expect(formatPhone('469 86 75')).toBeNull();
    expect(scheduleText(company.schedule)).toBe('Пн–Пт 9:00–18:00');
    expect(scheduleText({ days: [1, 2, 3, 4, 5, 6], opens: '08:30', closes: '17:00' })).toBe(
      'Пн–Сб 8:30–17:00',
    );
    expect(scheduleText({ days: [1, 3, 4], opens: '10:00', closes: '14:00' })).toBe(
      'Пн, Ср–Чт 10:00–14:00',
    );
  });
});

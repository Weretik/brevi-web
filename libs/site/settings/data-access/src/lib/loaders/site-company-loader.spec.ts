import { COMPANY } from '@site/core/config';
import { describe, expect, it } from 'vitest';

import { hoursLabel, mapSiteCompany } from './site-company-loader';

const answer = {
  phone: { e164: '+380504698675', display: '050 469 86 75' },
  email: 'pp.brevi@gmail.com',
  city: { uk: 'Полтава', ru: 'Полтава' },
  street: { uk: 'вул. Кагамлика, 3А', ru: 'ул. Кагамлыка, 3А' },
  mapQuery: 'Полтава, вулиця Кагамлика, 3А',
  schedule: { days: [1, 2, 3, 4, 5, 6], opens: '09:00', closes: '18:00' },
  managers: [
    {
      name: { uk: 'Вадим Осауленко', ru: 'Вадим Осауленко' },
      photoUrl: 'javascript:alert(1)',
      phones: [{ e164: '+380503467546', display: '050 346 75 46' }],
      email: null,
    },
  ],
  bankDetails: {
    recipient: { uk: 'ПП «Бреві»', ru: 'ЧП «Бреви»' },
    edrpou: '35521636',
    iban: 'UA63 305299 00000 26004041206862',
    bank: { uk: 'ПриватБанк', ru: 'ПриватБанк' },
  },
  socials: {
    instagram: 'https://instagram.com/brevi',
    youtube: 'http://youtube.com',
    facebook: null,
  },
};

describe('mapSiteCompany', () => {
  it('reads «Контакти та компанія» and keeps the site name and logo', () => {
    const company = mapSiteCompany(answer);
    expect(company.name).toBe(COMPANY.name);
    expect(company.logo).toBe(COMPANY.logo);
    expect(company.phones).toEqual([{ e164: '+380504698675', display: '050 469 86 75' }]);
    expect(company.openingHours).toEqual({
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
      label: { uk: 'Пн–Сб 9:00–18:00', ru: 'Пн–Сб 9:00–18:00' },
    });
    expect(company.managers[0]).toMatchObject({ photo: null, email: null });
    expect(company.socials.map((social) => social.url)).toEqual([
      'https://instagram.com/brevi',
      null,
      null,
    ]);
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapSiteCompany({ ...answer, phone: '050 469 86 75' })).toThrow();
    expect(() =>
      mapSiteCompany({ ...answer, schedule: { days: [], opens: '09:00', closes: '18:00' } }),
    ).toThrow();
  });

  it('names separate days apart and Sunday in each language', () => {
    expect(hoursLabel([1, 3, 7], '10:00', '14:00', 'ru')).toBe('Пн, Ср, Вс 10:00–14:00');
  });
});

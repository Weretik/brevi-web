import { describe, expect, it } from 'vitest';

import { mapSiteCompany } from './site-company.mapper';

const answer = {
  phone: '050 469 86 75',
  email: 'pp.brevi@gmail.com',
  city: { uk: 'Полтава', ru: 'Полтава' },
  street: { uk: 'вул. Кагамлика, 3А', ru: 'ул. Кагамлыка, 3А' },
  mapQuery: 'Полтава',
  schedule: { days: [1, 2, 3, 4, 5], opens: '09:00', closes: '18:00' },
  managers: [
    {
      name: { uk: 'Вадим', ru: 'Вадим' },
      photoUrl: '/assets/contacts/vadym-osaulenko.webp',
      phones: ['050 346 75 46'],
      email: null,
    },
  ],
  bankDetails: {
    recipient: { uk: 'ПП', ru: 'ЧП' },
    edrpou: '35521636',
    iban: 'UA63 305299 00000 26004041206862',
    bank: { uk: 'ПриватБанк', ru: 'ПриватБанк' },
  },
  socials: { instagram: null, youtube: 'https://youtube.com/@brevi', facebook: null },
  revision: 1,
  updatedAtUtc: '2026-11-11T00:00:00Z',
  updatedBy: 'Дані сайту',
};

describe('mapSiteCompany', () => {
  it('maps the company facts', () => {
    expect(mapSiteCompany(answer)).toMatchObject({
      phone: '050 469 86 75',
      schedule: { days: [1, 2, 3, 4, 5] },
      managers: [{ phones: ['050 346 75 46'], email: null }],
      socials: { youtube: 'https://youtube.com/@brevi' },
    });
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapSiteCompany({ ...answer, managers: [{ name: 'Вадим' }] })).toThrow();
  });
});

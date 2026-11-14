import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SiteCompanyView } from './site-company-view';

afterEach(cleanup);

const both = (uk: string, ru = uk) => ({ uk, ru });

describe('SiteCompanyView', () => {
  it('lays out contacts, address, links, managers and payment details as cards', () => {
    render(
      <SiteCompanyView
        company={{
          phone: '050 469 86 75',
          email: 'info@example.com',
          city: both('Дніпро', 'Днепр'),
          street: both('вул. Робоча, 1'),
          mapQuery: 'Дніпро, Робоча 1',
          schedule: { days: [1, 2, 3, 4, 5], opens: '09:00', closes: '18:00' },
          managers: [
            { name: both('Олена'), photoUrl: null, phones: ['050 000 00 00'], email: null },
          ],
          bankDetails: {
            recipient: both('ТОВ «Бреві»'),
            edrpou: '12345678',
            iban: 'UA00',
            bank: both('Банк'),
          },
          socials: { instagram: 'https://instagram.com/brevi', youtube: null, facebook: null },
          revision: 1,
          updatedAtUtc: null,
          updatedBy: null,
        }}
      />,
    );
    for (const title of [
      'Звʼязок',
      'Адреса',
      'Соцмережі',
      'Менеджери на сторінці «Контакти»',
      'Реквізити для оплати',
    ]) {
      expect(screen.getByRole('heading', { name: title })).toBeTruthy();
    }
    expect(screen.getByText('Пн–Пт 9:00–18:00')).toBeTruthy();
    expect(screen.getByText('рос.: Днепр')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'https://instagram.com/brevi' }).getAttribute('target'),
    ).toBe('_blank');
    expect(screen.getAllByText('Без посилання: на сайті лише назва')).toHaveLength(2);
    expect(screen.getByText('050 000 00 00')).toBeTruthy();
  });
});

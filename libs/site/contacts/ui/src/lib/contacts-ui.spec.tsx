import { COMPANY } from '@site/core/config';
import { render, screen } from '@testing-library/react';

import { getContactsDictionary } from './i18n/contacts-dictionary';
import { ContactsInfo } from './sections/contacts-info';
import { ContactsManagers } from './sections/contacts-managers';
import { ContactsMap } from './sections/contacts-map';

const shape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('contacts dictionary', () => {
  it('has the same keys in both languages', () => {
    expect(shape(getContactsDictionary('ru'))).toEqual(shape(getContactsDictionary('uk')));
  });
});

describe('ContactsInfo', () => {
  it('shows the phone, the email, the address, and the hours', () => {
    render(
      <ContactsInfo company={COMPANY} locale="uk" dictionary={getContactsDictionary('uk').info} />,
    );

    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.queryByRole('link', { name: '0532 67 11 09' })).toBeNull();
    expect(screen.getByRole('link', { name: 'pp.brevi@gmail.com' }).getAttribute('href')).toBe(
      'mailto:pp.brevi@gmail.com',
    );
    expect(screen.getByText('Україна, м. Полтава, вул. Кагамлика, 3А')).toBeTruthy();
    expect(screen.getByText('09:00–18:00')).toBeTruthy();
    expect(screen.getByText('вихідні')).toBeTruthy();
  });
});

describe('ContactsMap', () => {
  it('embeds a lazy map with a title and links to the place in Maps', () => {
    const dictionary = getContactsDictionary('uk').info;
    render(<ContactsMap company={COMPANY} locale="uk" dictionary={dictionary} />);

    const frame = screen.getByTitle(dictionary.mapTitle);
    expect(frame.getAttribute('loading')).toBe('lazy');
    expect(frame.getAttribute('src')).toContain('output=embed');
    const link = screen.getByRole('link', { name: /Відкрити в Картах/ });
    expect(link.getAttribute('href')).toContain('https://www.google.com/maps/search/');
    expect(link.getAttribute('rel')).toContain('noopener');
  });
});

describe('ContactsManagers', () => {
  it('lists the managers with their phones and email', () => {
    render(
      <ContactsManagers
        company={COMPANY}
        locale="uk"
        dictionary={getContactsDictionary('uk').managers}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Анастасія Берегових' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '050 309 06 60' }).getAttribute('href')).toBe(
      'tel:+380503090660',
    );
    expect(screen.getByRole('link', { name: '050 346 75 46' }).getAttribute('href')).toBe(
      'tel:+380503467546',
    );
    expect(screen.getByRole('link', { name: 'brevi.pl05@gmail.com' })).toBeTruthy();
  });
});

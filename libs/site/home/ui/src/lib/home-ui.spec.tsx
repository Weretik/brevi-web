import { CATALOG_SECTIONS } from '@site/catalog/model';
import { render, screen, within } from '@testing-library/react';

import { getHomeDictionary } from './i18n/home-dictionary';
import { HomeCatalog } from './sections/home-catalog';
import { HomeContacts } from './sections/home-contacts';
import { HomeHero } from './sections/home-hero';
import { HomeSeoText } from './sections/home-seo-text';

const shape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('home dictionary', () => {
  it('has the same blocks and list lengths in both languages', () => {
    expect(shape(getHomeDictionary('ru'))).toEqual(shape(getHomeDictionary('uk')));
  });
});

describe('HomeHero', () => {
  it('shows the offer, the request action, the sales phone, and the callouts', () => {
    const dictionary = getHomeDictionary('uk').hero;
    render(<HomeHero dictionary={dictionary} requestHref="#zayavka" />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(screen.getByRole('link', { name: 'Залишити заявку' }).getAttribute('href')).toBe(
      '#zayavka',
    );
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.getByRole('img', { name: dictionary.imageAlt })).toBeTruthy();
    expect(within(screen.getByRole('figure')).getAllByRole('listitem')).toHaveLength(4);
  });
});

describe('HomeCatalog', () => {
  it('renders every catalog section as a link in the page language', () => {
    render(
      <HomeCatalog
        locale="ru"
        sections={CATALOG_SECTIONS}
        categoryHref={(slug) => `/ru/catalog/${slug}`}
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(CATALOG_SECTIONS.length);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      CATALOG_SECTIONS.map((section) => `/ru/catalog/${section.slug}`),
    );
    expect(screen.getByText(CATALOG_SECTIONS[0].label.ru)).toBeTruthy();
  });
});

describe('HomeContacts', () => {
  it('gives the phones, e-mail, address, and the contacts page link', () => {
    const dictionary = getHomeDictionary('uk').contacts;
    render(
      <HomeContacts id="zayavka" locale="uk" dictionary={dictionary} contactsHref="/uk/contacts" />,
    );

    const section = screen.getByRole('region', { name: dictionary.title });
    expect(section.id).toBe('zayavka');
    expect(within(section).getByRole('link', { name: 'Зателефонувати' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(
      within(section).getByRole('link', { name: 'Написати на пошту' }).getAttribute('href'),
    ).toBe('mailto:pp.brevi@gmail.com');
    expect(
      within(section)
        .getByRole('link', { name: /Як нас знайти/ })
        .getAttribute('href'),
    ).toBe('/uk/contacts');
    expect(within(section).getByText(/вул\. Кагамлика, 3А/)).toBeTruthy();
  });
});

describe('HomeSeoText', () => {
  it('keeps every FAQ answer in the HTML', () => {
    const dictionary = getHomeDictionary('uk').seo;
    const { container } = render(<HomeSeoText dictionary={dictionary} />);

    expect(container.querySelectorAll('details')).toHaveLength(dictionary.faq.length);
    for (const item of dictionary.faq) {
      expect(container.textContent).toContain(item.text);
    }
  });
});

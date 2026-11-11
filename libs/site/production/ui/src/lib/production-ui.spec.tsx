import { COMPANY } from '@site/core/config';
import { render, screen } from '@testing-library/react';

import { getProductionDictionary } from './i18n/production-dictionary';
import { ProductionHero } from './sections/production-hero';
import { ProductionOrder } from './sections/production-order';
import { ProductionStages } from './sections/production-stages';

const shape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('production dictionary', () => {
  it('has the same blocks and list lengths in both languages', () => {
    expect(shape(getProductionDictionary('ru'))).toEqual(shape(getProductionDictionary('uk')));
  });
});

describe('ProductionHero', () => {
  it('shows breadcrumbs, the h1, both lead paragraphs, and the two actions', () => {
    const dictionary = getProductionDictionary('uk');
    render(
      <ProductionHero
        dictionary={dictionary}
        breadcrumbs={[
          { name: dictionary.home, href: '/uk' },
          { name: dictionary.breadcrumb, href: '/uk/about-company' },
        ]}
        discussHref="/uk#zayavka"
        worksHref="/uk/our-work"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(screen.getByRole('link', { name: 'Головна' }).getAttribute('href')).toBe('/uk');
    expect(screen.getByText(dictionary.lead[1])).toBeTruthy();
    expect(screen.getByRole('link', { name: dictionary.discuss }).getAttribute('href')).toBe(
      '/uk#zayavka',
    );
    expect(screen.getByRole('link', { name: /Переглянути наші роботи/ }).getAttribute('href')).toBe(
      '/uk/our-work',
    );
    expect(screen.getByRole('img', { name: dictionary.imageAlt })).toBeTruthy();
  });
});

describe('ProductionStages', () => {
  it('lists the three stages in order', () => {
    const dictionary = getProductionDictionary('uk').stages;
    render(<ProductionStages dictionary={dictionary} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent)).toEqual(
      dictionary.steps.map((step) => step.title),
    );
  });
});

describe('ProductionOrder', () => {
  it('offers the request action, the sales phone, and links to contacts and works', () => {
    const dictionary = getProductionDictionary('ru').order;
    render(
      <ProductionOrder
        company={COMPANY}
        id="production-order"
        dictionary={dictionary}
        discussHref="/ru#zayavka"
        contactsHref="/ru/contacts"
        worksHref="/ru/our-work"
      />,
    );

    expect(screen.getByRole('region', { name: dictionary.title })).toBeTruthy();
    expect(screen.getByRole('link', { name: dictionary.discuss }).getAttribute('href')).toBe(
      '/ru#zayavka',
    );
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.getByRole('link', { name: /Контакты/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
    expect(screen.getByRole('link', { name: /Наши работы/ }).getAttribute('href')).toBe(
      '/ru/our-work',
    );
  });
});

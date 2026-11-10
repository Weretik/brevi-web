import { getProductionDictionary } from '@site/production/ui';
import { render, screen } from '@testing-library/react';

import { ProductionPage } from './production-page';

describe('ProductionPage', () => {
  it('renders one h1 and the blocks in the order of the live page', () => {
    const dictionary = getProductionDictionary('uk');
    render(<ProductionPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.stages.title,
      dictionary.fabric.title,
      dictionary.details.title,
      dictionary.branding.title,
      dictionary.order.title,
    ]);
  });

  it('links to the localized pages', () => {
    render(<ProductionPage locale="ru" />);

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(
      screen.getByRole('link', { name: /Нанесение логотипа на спецодежду/ }).getAttribute('href'),
    ).toBe('/ru/logo-printing');
    expect(screen.getByRole('link', { name: /Контакты/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
    expect(
      screen.getByRole('link', { name: 'Обсудить пошив спецодежды' }).getAttribute('href'),
    ).toBe('/ru#zayavka');
  });

  it('describes the breadcrumb trail in JSON-LD', () => {
    const { container } = render(<ProductionPage locale="uk" />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      'https://brevi.com.ua/uk',
      'https://brevi.com.ua/uk/about-company',
    ]);
  });
});

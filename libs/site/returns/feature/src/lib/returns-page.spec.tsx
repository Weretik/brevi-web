import { getReturnsDictionary } from '@site/returns/ui';
import { render, screen } from '@testing-library/react';

import { ReturnsPage } from './returns-page';

describe('ReturnsPage', () => {
  it('renders one h1 and the three parts in the order of the live page', () => {
    const dictionary = getReturnsDictionary('uk');
    render(<ReturnsPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.general.title,
      dictionary.conditions.title,
      dictionary.steps.title,
    ]);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(9);
  });

  it('links to the localized home and contacts pages', () => {
    render(<ReturnsPage locale="ru" />);

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Контакты/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
  });

  it('describes the breadcrumb trail in JSON-LD', () => {
    const { container } = render(<ReturnsPage locale="uk" />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[1].item).toBe('https://brevi.com.ua/uk/returns-exchanges');
  });
});

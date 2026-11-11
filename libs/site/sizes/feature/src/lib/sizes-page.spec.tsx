import { render, screen } from '@testing-library/react';

import { SizesPage } from './sizes-page';

describe('SizesPage', () => {
  it('renders one h1 and the four blocks', () => {
    render(<SizesPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
    expect(screen.getAllByRole('table')).toHaveLength(5);
  });

  it('links to the localized home and contacts pages and describes the breadcrumbs', () => {
    const { container } = render(<SizesPage locale="ru" />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Контакты/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
    expect(data.itemListElement[1].item).toBe('https://brevi.com.ua/ru/size-chart');
  });
});

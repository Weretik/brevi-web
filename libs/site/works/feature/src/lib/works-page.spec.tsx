import { WORK_PHOTOS, getWorksDictionary } from '@site/works/ui';
import { render, screen } from '@testing-library/react';

import { WorksPage } from './works-page';

describe('WorksPage', () => {
  it('renders one h1, the whole gallery, and the closing block', () => {
    const dictionary = getWorksDictionary('uk');
    render(<WorksPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.gallery.title,
      dictionary.order.title,
    ]);
    expect(screen.getAllByRole('img')).toHaveLength(WORK_PHOTOS.length);
  });

  it('links to the localized pages', () => {
    render(<WorksPage locale="ru" />);

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(
      screen.getByRole('link', { name: 'Обсудить пошив спецодежды' }).getAttribute('href'),
    ).toBe('/ru#zayavka');
    expect(screen.getByRole('link', { name: /О производстве/ }).getAttribute('href')).toBe(
      '/ru/about-company',
    );
  });

  it('describes the breadcrumb trail in JSON-LD', () => {
    const { container } = render(<WorksPage locale="uk" />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[1].item).toBe('https://brevi.com.ua/uk/our-work');
  });
});

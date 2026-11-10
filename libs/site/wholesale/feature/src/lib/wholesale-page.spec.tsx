import { getWholesaleDictionary } from '@site/wholesale/ui';
import { render, screen } from '@testing-library/react';

import { WholesalePage } from './wholesale-page';

describe('WholesalePage', () => {
  it('renders one h1 and the blocks in order', () => {
    const dictionary = getWholesaleDictionary('uk');
    render(<WholesalePage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.tiers.title,
      dictionary.range.title,
      dictionary.reasons.title,
      dictionary.order.title,
    ]);
  });

  it('links to the localized pages around the order', () => {
    render(<WholesalePage locale="ru" />);

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Весь каталог/ }).getAttribute('href')).toBe(
      '/ru/catalog',
    );
    expect(screen.getByRole('link', { name: /Пошив с логотипом/ }).getAttribute('href')).toBe(
      '/ru/logo-printing',
    );
    expect(screen.getByRole('link', { name: /О производстве/ }).getAttribute('href')).toBe(
      '/ru/about-company',
    );
    for (const request of screen.getAllByRole('link', { name: 'Оставить заявку' })) {
      expect(request.getAttribute('href')).toBe('/ru/request');
      expect(request.getAttribute('rel')).toBe('nofollow');
    }
  });

  it('describes the breadcrumb trail in JSON-LD and shows no prices', () => {
    const { container } = render(<WholesalePage locale="uk" />);
    const [breadcrumbs] = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (node) => JSON.parse(node.textContent ?? '{}'),
    );

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement[1].item).toBe('https://brevi.com.ua/uk/order-in-bulk');
    expect(container.textContent).not.toMatch(/\d+\s*грн/);
  });
});

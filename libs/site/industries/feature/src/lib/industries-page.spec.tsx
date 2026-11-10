import { getIndustriesDictionary } from '@site/industries/ui';
import { render, screen } from '@testing-library/react';

import { IndustriesPage } from './industries-page';

describe('IndustriesPage', () => {
  it('renders one h1 and the blocks in the order of the live page', () => {
    const dictionary = getIndustriesDictionary('uk');
    render(<IndustriesPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.list.title,
      dictionary.steps.title,
      dictionary.faq.title,
      dictionary.order.title,
    ]);
  });

  it('links to the localized pages around the order', () => {
    render(<IndustriesPage locale="ru" />);

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Примеры наших работ/ }).getAttribute('href')).toBe(
      '/ru/our-work',
    );
    expect(screen.getByRole('link', { name: /Пошив с логотипом/ }).getAttribute('href')).toBe(
      '/ru/logo-printing',
    );
    expect(screen.getByRole('link', { name: /Цены для опта/ }).getAttribute('href')).toBe(
      '/ru/order-in-bulk',
    );
    for (const request of screen.getAllByRole('link', { name: 'Оставить заявку' })) {
      expect(request.getAttribute('href')).toBe('/ru/request');
      expect(request.getAttribute('rel')).toBe('nofollow');
    }
  });

  it('repeats the breadcrumb trail and the visible questions in JSON-LD', () => {
    const dictionary = getIndustriesDictionary('uk');
    const { container } = render(<IndustriesPage locale="uk" />);
    const [breadcrumbs, faq] = [
      ...container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((node) => JSON.parse(node.textContent ?? '{}'));

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement[1].item).toBe('https://brevi.com.ua/uk/industries');
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity.map((item: { name: string }) => item.name)).toEqual(
      dictionary.faq.items.map((item) => item.title),
    );
  });
});

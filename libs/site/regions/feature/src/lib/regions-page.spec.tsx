import { getRegionsDictionary } from '@site/regions/ui';
import { render, screen } from '@testing-library/react';

import { RegionsPage } from './regions-page';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('RegionsPage', () => {
  it('renders one h1 and the blocks in order', async () => {
    const dictionary = getRegionsDictionary('uk');
    render(await RegionsPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.steps.title,
      dictionary.cities.title,
      dictionary.local.title,
      dictionary.order.title,
    ]);
  });

  it('links to the localized pages around the order', async () => {
    render(await RegionsPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(
      screen.getByRole('link', { name: /Условия доставки и оплаты/ }).getAttribute('href'),
    ).toBe('/ru/delivery-and-payment');
    expect(screen.getByRole('link', { name: /Адрес и контакты/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
    expect(screen.getByRole('link', { name: /Отрасли/ }).getAttribute('href')).toBe(
      '/ru/industries',
    );
    for (const request of screen.getAllByRole('link', { name: 'Оставить заявку' })) {
      expect(request.getAttribute('href')).toBe('/ru/request');
      expect(request.getAttribute('rel')).toBe('nofollow');
    }
  });

  it('is one page for all cities: the cities are text, not links', async () => {
    const { container } = render(await RegionsPage({ locale: 'uk' }));
    const [breadcrumbs] = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (node) => JSON.parse(node.textContent ?? '{}'),
    );

    expect(breadcrumbs.itemListElement[1].item).toBe('https://brevi.com.ua/uk/regions');
    expect(screen.getByText('Харків').closest('a')).toBeNull();
    expect(container.querySelector('a[href*="/regions/"]')).toBeNull();
  });
});

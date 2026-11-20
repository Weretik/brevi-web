import { findCity } from '@site/cities/model';
import { render, screen, within } from '@testing-library/react';

import { SewingCityPage } from './sewing-city-page';
import { WorkwearCityPage } from './workwear-city-page';

import type { CatalogProductCard } from '@site/catalog/model';
import type { City } from '@site/cities/model';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

const KHARKIV = findCity('kharkiv') as City;
const POLTAVA = findCity('poltava') as City;
const PRODUCTS: CatalogProductCard[] = ['kostium', 'kurtka', 'napivkombinezon'].map((slug) => ({
  slug,
  type: 'Sewing',
  code: null,
  name: `Модель ${slug}`,
  image: 'https://media.brevi.com.ua/x.jpg',
  priceFrom: 900,
  fabrics: [],
}));

const jsonLd = (container: HTMLElement) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
    JSON.parse(node.textContent ?? '{}'),
  );

describe('city pages', () => {
  it('renders «Пошиття» with one h1 naming the city and its blocks in order', async () => {
    render(await SewingCityPage({ locale: 'uk', city: KHARKIV, products: PRODUCTS }));

    expect(screen.getAllByRole('heading', { level: 1 }).map((node) => node.textContent)).toEqual([
      'Пошиття спецодягу на замовлення у Харкові',
    ]);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      'Що шиємо для роботи у Харкові',
      'Як наносимо логотип',
      'Моделі власного пошиття',
      'Як замовити пошиття з іншого міста',
      'Працюємо по всій Україні',
      'Питання про пошиття у Харкові',
      'Інші міста',
      'Замовте пошиття спецодягу у Харкові',
    ]);
  });

  it('opens the request window from «Купити» with the model in the form', async () => {
    render(await SewingCityPage({ locale: 'uk', city: KHARKIV, products: PRODUCTS }));

    const [buy] = screen.getAllByRole('link', { name: /Купити/ });
    expect(buy.getAttribute('href')).toBe(
      '/uk/request?product=%D0%9C%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C+kostium',
    );
  });

  it('links to nearby cities of the same kind, the pair page and «Регіони»', async () => {
    render(await WorkwearCityPage({ locale: 'uk', city: KHARKIV, products: [] }));

    const links = screen.getByRole('region', { name: 'Інші міста' });
    expect(within(links).getByRole('link', { name: 'Полтава' }).getAttribute('href')).toBe(
      '/uk/workwear/poltava',
    );
    expect(
      within(links)
        .getByRole('link', { name: /Пошиття спецодягу у Харкові/ })
        .getAttribute('href'),
    ).toBe('/uk/sewing/kharkiv');
    expect(
      within(links)
        .getByRole('link', { name: /Доставка в інші міста/ })
        .getAttribute('href'),
    ).toBe('/uk/regions');
  });

  it('leaves the models out while the catalog has none and keeps the numbering', async () => {
    render(await WorkwearCityPage({ locale: 'ru', city: KHARKIV, products: [] }));

    expect(
      screen.queryByRole('heading', { name: 'Популярные модели и средства защиты' }),
    ).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Рабочая одежда и спецодежда в Харькове',
    );
    expect(screen.getByText('07 · Заказ')).toBeTruthy();
  });

  it('marks up the breadcrumbs and the visible questions', async () => {
    const { container } = render(
      await WorkwearCityPage({ locale: 'uk', city: KHARKIV, products: [] }),
    );
    const [breadcrumbs, faq] = jsonLd(container);

    expect(breadcrumbs.itemListElement.map((item: { name: string }) => item.name)).toEqual([
      'Головна',
      'Регіони',
      'Робочий одяг у Харкові',
    ]);
    expect(breadcrumbs.itemListElement[2].item).toBe('https://brevi.com.ua/uk/workwear/kharkiv');
    expect(faq['@type']).toBe('FAQPage');
    for (const question of faq.mainEntity) expect(screen.getByText(question.name)).toBeTruthy();
  });

  it('tells Poltava buyers about free pickup', async () => {
    render(await SewingCityPage({ locale: 'uk', city: POLTAVA, products: [] }));

    expect(within(screen.getByLabelText('Умови')).getByText('Самовивіз')).toBeTruthy();
  });
});

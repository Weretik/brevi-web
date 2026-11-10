import { render, screen, within } from '@testing-library/react';

import { formatModelCount, getCatalogDictionary } from './i18n/catalog-dictionary';
import { CatalogProductGrid } from './sections/catalog-product-grid';
import { CatalogSectionsGrid } from './sections/catalog-sections-grid';
import { CatalogSubcategories } from './sections/catalog-subcategories';
import { CatalogText } from './sections/catalog-text';

import type { CatalogTreeNode } from '@site/catalog/model';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

const dictionary = getCatalogDictionary('uk');
const href = (slug: string) => `/uk/catalog/${slug}`;
const child: CatalogTreeNode = {
  slug: 'zhylety',
  name: { uk: 'Жилети', ru: 'Жилеты' },
  productCount: 5,
  children: [],
};
const section: CatalogTreeNode = {
  slug: 'specodyag-zymovyj',
  name: { uk: 'Спецодяг зимовий', ru: 'Зимняя спецодежда' },
  productCount: 33,
  children: [child],
};

describe('catalog blocks', () => {
  it('has the same text items in both languages', () => {
    expect(shape(getCatalogDictionary('ru'))).toEqual(shape(dictionary));
  });

  it('counts models by the plural rules of each language', () => {
    expect(formatModelCount('uk', 1)).toBe('1 модель');
    expect(formatModelCount('uk', 3)).toBe('3 моделі');
    expect(formatModelCount('uk', 85)).toBe('85 моделей');
    expect(formatModelCount('ru', 22)).toBe('22 модели');
    expect(formatModelCount('ru', 11)).toBe('11 моделей');
  });

  it('links a section card and its subsections to their category pages', () => {
    render(
      <CatalogSectionsGrid locale="uk" sections={[section]} label="Розділи" categoryHref={href} />,
    );

    const card = within(screen.getByRole('list', { name: 'Розділи' }));
    expect(card.getByRole('link', { name: 'Спецодяг зимовий' }).getAttribute('href')).toBe(
      '/uk/catalog/specodyag-zymovyj',
    );
    expect(card.getByRole('link', { name: 'Жилети' }).getAttribute('href')).toBe(
      '/uk/catalog/zhylety',
    );
    expect(card.getByText('33 моделі')).toBeTruthy();
  });

  it('shows subsections as links with their model counts', () => {
    render(
      <CatalogSubcategories
        locale="ru"
        categories={[child]}
        label="Подразделы"
        categoryHref={href}
      />,
    );

    const nav = within(screen.getByRole('navigation', { name: 'Подразделы' }));
    expect(nav.getByRole('link', { name: /Жилеты/ }).getAttribute('href')).toBe(
      '/uk/catalog/zhylety',
    );
  });

  it('shows a product with its photo, name, and the price request link, and no price', () => {
    render(
      <CatalogProductGrid
        locale="uk"
        dictionary={dictionary.products}
        requestHref="/uk/request"
        products={[
          {
            slug: 'kostyum-verde',
            name: { uk: 'Костюм ВЕРДЕ', ru: 'Костюм ВЕРДЕ' },
            image: { src: '/catalog/products/kostyum-verde.webp', width: 400, height: 560 },
          },
          { slug: 'bez-foto', name: { uk: 'Модель без фото', ru: 'Модель без фото' }, image: null },
        ]}
      />,
    );

    expect(screen.getByRole('img', { name: 'Костюм ВЕРДЕ' })).toBeTruthy();
    expect(screen.getByText(dictionary.products.noPhoto)).toBeTruthy();
    const link = screen.getByRole('link', { name: 'Дізнатися ціну: Костюм ВЕРДЕ' });
    expect(link.getAttribute('href')).toBe('/uk/request');
    expect(link.getAttribute('rel')).toBe('nofollow');
    expect(screen.queryByText(/грн/)).toBeNull();
  });

  it('renders the text about a category as headings, paragraphs, and lists', () => {
    render(
      <CatalogText
        blocks={[
          { type: 'heading', text: 'Тканини' },
          { type: 'paragraph', text: 'Бавовна добре поглинає вологу.' },
          { type: 'list', items: ['саржа', 'грета'] },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Тканини' })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

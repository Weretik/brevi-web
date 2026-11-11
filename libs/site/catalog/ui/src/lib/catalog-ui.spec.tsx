import { COMPANY } from '@site/core/config';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { formatModelCount, getCatalogDictionary } from './i18n/catalog-dictionary';
import { CatalogProductBuy } from './sections/catalog-product-buy';
import { CatalogProductGallery } from './sections/catalog-product-gallery';
import { CatalogProductGrid } from './sections/catalog-product-grid';
import { CatalogProductSpecs } from './sections/catalog-product-specs';
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
  productType: 'Sewing',
  sectionId: 7,
  children: [],
};
const section: CatalogTreeNode = {
  slug: 'specodyag-zymovyj',
  name: { uk: 'Спецодяг зимовий', ru: 'Зимняя спецодежда' },
  productCount: 33,
  productType: 'Sewing',
  sectionId: null,
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

  it('shows a product with its photo, name, and the lowest price', () => {
    render(
      <CatalogProductGrid
        dictionary={dictionary.products}
        requestHref="/uk/request"
        productHref={(slug) => `/uk/product/${slug}`}
        products={[
          {
            slug: 'kostyum-verde',
            name: 'Костюм ВЕРДЕ',
            image: 'https://media.example/kostyum-verde.webp',
            priceFrom: 1250,
          },
          { slug: 'bez-foto', name: 'Модель без фото', image: null, priceFrom: null },
        ]}
      />,
    );

    expect(screen.getByRole('img', { name: 'Костюм ВЕРДЕ' }).getAttribute('src')).toBe(
      'https://media.example/kostyum-verde.webp',
    );
    expect(screen.getByText(dictionary.products.noPhoto)).toBeTruthy();
    expect(screen.getByText('1 250')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Дізнатися ціну: Костюм ВЕРДЕ' })).toBeNull();
    // A product without a price asks to learn it from a manager.
    const link = screen.getByRole('link', { name: 'Дізнатися ціну: Модель без фото' });
    expect(link.getAttribute('href')).toBe('/uk/request');
    expect(link.getAttribute('rel')).toBe('nofollow');
    expect(screen.getByRole('link', { name: 'Костюм ВЕРДЕ' }).getAttribute('href')).toBe(
      '/uk/product/kostyum-verde',
    );
  });

  it('switches the product photo by its thumbnail', () => {
    render(
      <CatalogProductGallery
        name="Костюм ВЕРДЕ"
        labels={{ gallery: 'Фото моделі', photo: 'Фото', noPhoto: 'Фото готується' }}
        photos={[
          { src: 'https://media.example/kostyum-verde/1.webp' },
          { src: 'https://media.example/kostyum-verde/2.webp' },
        ]}
      />,
    );

    expect(screen.getByRole('img', { name: 'Костюм ВЕРДЕ' }).getAttribute('src')).toContain(
      '/1.webp',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Фото 2' }));
    expect(screen.getByRole('img', { name: 'Костюм ВЕРДЕ, Фото 2' }).getAttribute('src')).toContain(
      '/2.webp',
    );
    expect(screen.getByRole('button', { name: 'Фото 2' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('shows the model, short facts, and the prices of the chosen fabric with the ways to order', () => {
    render(
      <CatalogProductBuy
        company={COMPANY}
        model="992"
        summary={[{ type: 'paragraph', lead: 'Сезон:', text: 'літо' }]}
        fabrics={[
          {
            sku: 'MOD-992-1',
            name: 'Грета',
            details: 'бавовна 35 %, 210 г/м²',
            prices: { retail: 1500, wholesale: 1400, largeWholesale: 1250.5 },
          },
          { sku: 'MOD-992-2', name: 'Саржа', details: null, prices: null },
        ]}
        prices={null}
        dictionary={dictionary.product}
        requestHref="/uk/request"
      />,
    );

    expect(screen.getByText('992')).toBeTruthy();
    expect(screen.getByText('Сезон:').tagName).toBe('STRONG');
    const prices = within(screen.getByRole('table', { name: 'Ціна за одиницю, грн' }));
    expect(prices.getByRole('row', { name: '1–9 шт 1\u00a0500' })).toBeTruthy();
    expect(prices.getByRole('row', { name: 'від 40 шт 1\u00a0250,5' })).toBeTruthy();
    expect(screen.getByText('бавовна 35 %, 210 г/м²')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Залишити заявку' }).getAttribute('href')).toBe(
      '/uk/request',
    );
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );

    // The second fabric has no price yet: a manager quotes it.
    fireEvent.click(screen.getByRole('button', { name: 'Саржа' }));
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByText(dictionary.product.priceNote)).toBeTruthy();
  });

  it('asks to learn the price when the product has none', () => {
    render(
      <CatalogProductBuy
        company={COMPANY}
        model={null}
        summary={[]}
        fabrics={[]}
        prices={null}
        dictionary={dictionary.product}
        requestHref="/uk/request"
      />,
    );

    expect(screen.getByRole('link', { name: 'Дізнатися ціну' }).getAttribute('href')).toBe(
      '/uk/request',
    );
    expect(screen.queryByText(/грн/)).toBeNull();
  });

  it('renders characteristics as a table per group', () => {
    render(
      <CatalogProductSpecs
        groups={[{ title: 'Трикотаж', rows: [{ name: 'Комір', value: 'високий' }] }]}
      />,
    );

    const table = within(screen.getByRole('table', { name: 'Трикотаж' }));
    expect(table.getByRole('rowheader', { name: 'Комір' })).toBeTruthy();
    expect(table.getByRole('cell', { name: 'високий' })).toBeTruthy();
  });

  it('renders the text about a category as headings, paragraphs, and lists', () => {
    render(
      <CatalogText
        blocks={[
          { type: 'heading', text: 'Тканини' },
          { type: 'paragraph', text: '**Бавовна** добре поглинає *вологу*.' },
          { type: 'list', items: ['саржа', 'грета'] },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Тканини' })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    // Formatting from the visual editor of the Admin is shown, never the marks themselves.
    expect(screen.getByText('Бавовна').tagName).toBe('STRONG');
    expect(screen.getByText('вологу').tagName).toBe('EM');
    expect(screen.queryByText(/\*/)).toBeNull();
  });
});

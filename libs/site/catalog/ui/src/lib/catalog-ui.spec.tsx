import { COMPANY } from '@site/core/config';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { formatModelCount, getCatalogDictionary } from './i18n/catalog-dictionary';
import { CatalogCategoryTabs } from './sections/catalog-category-tabs';
import { CatalogListing } from './sections/catalog-listing';
import { CatalogProductBuy } from './sections/catalog-product-buy';
import { CatalogProductGallery } from './sections/catalog-product-gallery';
import { CatalogProductGrid } from './sections/catalog-product-grid';
import { CatalogProductSpecs } from './sections/catalog-product-specs';
import { CatalogSearchBox } from './sections/catalog-search-box';
import { CatalogSectionGroups } from './sections/catalog-section-groups';
import { CatalogText } from './sections/catalog-text';

import type { CatalogProductCard } from '@site/catalog/model';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

const dictionary = getCatalogDictionary('uk');
const href = (slug: string) => `/uk/catalog/${slug}`;
const card = (
  slug: string,
  priceFrom: number | null,
  type: CatalogProductCard['type'] = 'Sewing',
): CatalogProductCard => ({
  slug,
  type,
  code: null,
  name: `Модель ${slug}`,
  image: null,
  priceFrom,
});

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

  it('shows the categories in two groups with their lowest price and subcategories', () => {
    render(
      <CatalogSectionGroups
        locale="uk"
        dictionary={dictionary}
        categoryHref={href}
        groups={[
          {
            type: 'Sewing',
            sections: [
              {
                slug: 'specodyag-zymovyj',
                name: 'Спецодяг зимовий',
                productCount: 33,
                priceFrom: 890,
                children: [{ slug: 'zhylety', name: 'Жилети' }],
              },
            ],
          },
          {
            type: 'Ppe',
            sections: [
              {
                slug: 'zahyst-ruk',
                name: 'Захист рук',
                productCount: 1,
                priceFrom: null,
                children: [],
              },
            ],
          },
        ]}
      />,
    );

    const own = within(screen.getByRole('region', { name: 'Власне пошиття' }));
    expect(own.getByRole('link', { name: 'Спецодяг зимовий' }).getAttribute('href')).toBe(
      '/uk/catalog/specodyag-zymovyj',
    );
    expect(own.getByRole('link', { name: 'Жилети' }).getAttribute('href')).toBe(
      '/uk/catalog/zhylety',
    );
    expect(own.getByText('33 моделі · від 890 грн')).toBeTruthy();
    const ppe = within(screen.getByRole('region', { name: 'Засоби захисту' }));
    expect(ppe.getByText('1 модель')).toBeTruthy();
  });

  it('shows the subcategories as tabs with «Усі» first and the open one marked', () => {
    render(
      <CatalogCategoryTabs
        parent={{ slug: 'specodyag-zymovyj', name: 'Спецодяг зимовий', count: 33 }}
        items={[
          { slug: 'kurtky', name: 'Куртки', count: 20 },
          { slug: 'zhylety', name: 'Жилети', count: 5 },
        ]}
        current="zhylety"
        label="Підрозділи"
        allLabel="Усі"
        categoryHref={href}
      />,
    );

    const links = within(screen.getByRole('navigation', { name: 'Підрозділи' })).getAllByRole(
      'link',
    );
    expect(links.map((link) => link.textContent)).toEqual(['Усі33', 'Куртки20', 'Жилети5']);
    expect(links[0].getAttribute('href')).toBe('/uk/catalog/specodyag-zymovyj');
    expect(links[2].getAttribute('aria-current')).toBe('page');
    expect(links[0].getAttribute('aria-current')).toBeNull();
  });

  it('filters a listing by price and kind, sorts it, and keeps the choice in the address', () => {
    window.history.replaceState(null, '', '/uk/catalog/zyma');
    const items = [
      card('a', 1480),
      card('b', 890),
      card('c', null),
      card('d', 1350),
      card('e', 1040, 'Ppe'),
      card('f', 2400),
      card('g', 650),
      card('h', 1190),
    ].map((product) => ({ product, href: `/uk/product/${product.slug}` }));
    render(
      <CatalogListing
        items={items}
        products={dictionary.products}
        text={dictionary.listing}
        requestHref="/uk/request"
      />,
    );
    const shown = () =>
      screen
        .getAllByRole('listitem')
        .filter((item) => !item.hidden)
        .map((item) => within(item).getByRole('heading').textContent);

    expect(shown()).toHaveLength(8);
    expect(screen.getByText('Знайдено 8')).toBeTruthy();

    // Wider screens: the price chip opens its ranges.
    fireEvent.click(screen.getByRole('button', { name: 'Ціна' }));
    fireEvent.click(screen.getByRole('button', { name: /^1.000 – 1.400$/ }));
    expect(shown()).toEqual(['Модель d', 'Модель e', 'Модель h']);
    expect(window.location.search).toBe('?price=1000-1400');
    // Every product link stays in the page for search engines.
    expect(screen.getAllByRole('listitem', { hidden: true })).toHaveLength(8);

    fireEvent.click(screen.getByRole('button', { name: 'Тип' }));
    fireEvent.click(screen.getByRole('button', { name: 'Засоби захисту' }));
    expect(shown()).toEqual(['Модель e']);

    fireEvent.click(screen.getByRole('button', { name: 'Скинути' }));
    fireEvent.click(screen.getByRole('button', { name: 'Порядок' }));
    fireEvent.click(screen.getByRole('button', { name: 'Спочатку дешевші' }));
    expect(shown()).toEqual([
      'Модель g',
      'Модель b',
      'Модель e',
      'Модель h',
      'Модель d',
      'Модель a',
      'Модель f',
      'Модель c',
    ]);
    expect(window.location.search).toBe('?sort=cheap');
  });

  it('shows 24 models and adds more on «Показати ще»', () => {
    window.history.replaceState(null, '', '/uk/catalog/lito');
    const items = Array.from({ length: 30 }, (_, index) => card(`p${index}`, 100 + index)).map(
      (product) => ({ product, href: `/uk/product/${product.slug}` }),
    );
    render(
      <CatalogListing
        items={items}
        products={dictionary.products}
        text={dictionary.listing}
        requestHref="/uk/request"
      />,
    );
    const visible = () => screen.getAllByRole('listitem').filter((item) => !item.hidden).length;

    expect(visible()).toBe(24);
    fireEvent.click(screen.getByRole('button', { name: 'Показати ще (6)' }));
    expect(visible()).toBe(30);
    expect(screen.queryByRole('button', { name: /Показати ще/ })).toBeNull();
  });

  it('suggests models and categories as the visitor types', async () => {
    const fetchIndex = vi.fn(async () =>
      Response.json({
        products: [
          {
            slug: 'kurtka-zametil',
            name: 'Куртка ЗАМЕТІЛЬ медіум',
            code: '1031',
            type: 'Sewing',
            image: null,
            priceFrom: 1350,
            href: '/uk/product/kurtka-zametil',
          },
          {
            slug: 'zhylet-lider',
            name: 'Жилет ЛІДЕР',
            code: null,
            type: 'Sewing',
            image: null,
            priceFrom: null,
            href: '/uk/product/zhylet-lider',
          },
        ],
        sections: [
          {
            slug: 'kurtky',
            name: 'Куртки зимові робочі',
            parent: 'Спецодяг зимовий',
            productCount: 20,
            href: '/uk/catalog/kurtky',
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchIndex);
    render(
      <CatalogSearchBox
        indexUrl="/api/catalog-search/uk"
        action="/uk/search"
        text={dictionary.search}
      />,
    );

    const field = screen.getByRole('combobox', { name: 'Пошук по каталогу' });
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: 'кур' } });

    const list = within(await screen.findByRole('listbox'));
    expect(list.getByRole('option', { name: /Куртка ЗАМЕТІЛЬ медіум/ })).toBeTruthy();
    expect(list.getByRole('option', { name: /Куртки зимові робочі/ })).toBeTruthy();
    expect(list.queryByRole('option', { name: /ЛІДЕР/ })).toBeNull();
    expect(list.getByRole('link', { name: /Усі результати \(1\)/ }).getAttribute('href')).toBe(
      '/uk/search?q=%D0%BA%D1%83%D1%80',
    );
    expect(fetchIndex).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
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
            type: 'Sewing',
            code: '1031',
            name: 'Костюм ВЕРДЕ',
            image: 'https://media.example/kostyum-verde.webp',
            priceFrom: 1250,
          },
          {
            slug: 'bez-foto',
            type: 'Ppe',
            code: null,
            name: 'Модель без фото',
            image: null,
            priceFrom: null,
          },
        ]}
      />,
    );

    expect(screen.getByRole('img', { name: 'Костюм ВЕРДЕ' }).getAttribute('src')).toBe(
      'https://media.example/kostyum-verde.webp',
    );
    expect(screen.getByText(dictionary.products.noPhoto)).toBeTruthy();
    expect(screen.getByText('1 250')).toBeTruthy();
    expect(screen.getByText('від 40 шт')).toBeTruthy();
    expect(screen.getByText('Модель 1031')).toBeTruthy();
    // Own sewing is marked; protective equipment is not.
    expect(screen.getAllByText('Власне пошиття')).toHaveLength(1);
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

  it('shows the lowest price, the fabrics, and the prices of the chosen fabric with the ways to order', () => {
    render(
      <CatalogProductBuy
        company={COMPANY}
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

    expect(screen.getByText(/^від 1\s250,5$/)).toBeTruthy();
    const prices = within(screen.getByRole('table', { name: 'Ціна за одиницю, грн' }));
    expect(prices.getByRole('row', { name: '1–9 шт 1\u00a0500' })).toBeTruthy();
    expect(
      prices.getByRole('row', { name: '10–39 шт 1\u00a0400 Економія 100 грн/шт' }),
    ).toBeTruthy();
    expect(
      prices.getByRole('row', { name: 'від 40 шт 1\u00a0250,5 Економія 250 грн/шт' }),
    ).toBeTruthy();
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

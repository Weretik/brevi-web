import {
  catalogQueryWords,
  normalizeCatalogText,
  searchCatalogProducts,
  searchCatalogSections,
} from './catalog-search';

const products = [
  { name: 'Куртка ЗАМЕТІЛЬ медіум', code: '1031', fabrics: ['Грета', 'Оксфорд'] },
  { name: 'Напівкомбінезон ЗАМЕТІЛЬ', code: '1045' },
  { name: 'Жилет КУР’ЄР', code: null },
  { name: 'Куртка ВЕЛЕС оrange', code: null },
  { name: 'Черевики HALWILL MF ESD', code: null },
];

describe('catalog search', () => {
  it('ignores case, apostrophes, and Latin letters that look Cyrillic', () => {
    expect(normalizeCatalogText('КУР’ЄР')).toBe(normalizeCatalogText('курєр'));
    expect(normalizeCatalogText('оrange')).toBe(normalizeCatalogText('orange'));
    expect(normalizeCatalogText('Ёлка')).toBe('елка');
    expect(catalogQueryWords(' рукавички  МБС/нітрил ')).toEqual(['рукавички', 'мбс', 'нітрил']);
  });

  it('finds products that have every word of the query', () => {
    expect(searchCatalogProducts(products, 'зам').map((item) => item.code)).toEqual([
      '1031',
      '1045',
    ]);
    expect(searchCatalogProducts(products, 'куртка заметіль').map((item) => item.code)).toEqual([
      '1031',
    ]);
    expect(searchCatalogProducts(products, 'кур’єр')).toHaveLength(1);
    expect(searchCatalogProducts(products, 'halwill')).toHaveLength(1);
    expect(searchCatalogProducts(products, 'orange')).toHaveLength(1);
  });

  it('finds a product by its fabric', () => {
    expect(searchCatalogProducts(products, 'куртка грета').map((item) => item.code)).toEqual([
      '1031',
    ]);
  });

  it('finds a product by its model number', () => {
    expect(searchCatalogProducts(products, '1045').map((item) => item.name)).toEqual([
      'Напівкомбінезон ЗАМЕТІЛЬ',
    ]);
  });

  it('puts words that start a word of the name first', () => {
    const items = [
      { name: 'Шапка вязана', code: null },
      { name: 'Куртка', code: null },
    ];
    expect(searchCatalogProducts(items, 'ка').map((item) => item.name)).toEqual([
      'Шапка вязана',
      'Куртка',
    ]);
    expect(searchCatalogProducts(items, 'кур').map((item) => item.name)).toEqual(['Куртка']);
  });

  it('finds nothing for an empty query', () => {
    expect(searchCatalogProducts(products, '  ')).toEqual([]);
  });

  it('finds a category by its own name and by the name of its parent', () => {
    const sections = [
      { name: 'Жилети', parent: 'Спецодяг зимовий' },
      { name: 'Жилети', parent: 'Сигнальний одяг' },
      { name: 'Захист рук', parent: null },
    ];
    expect(searchCatalogSections(sections, 'жилети')).toHaveLength(2);
    expect(searchCatalogSections(sections, 'жилети сигнальний')).toEqual([sections[1]]);
  });
});

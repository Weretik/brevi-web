import { parseCatalogInline, plainCatalogText } from './catalog-inline';

describe('catalog inline formatting', () => {
  it('reads bold, italic, both, and a typed asterisk', () => {
    expect(parseCatalogInline('**Куртка:** пряма, *тепла*, ***нова***, 5\\*5')).toEqual([
      { text: 'Куртка:', bold: true, italic: false },
      { text: ' пряма, ', bold: false, italic: false },
      { text: 'тепла', bold: false, italic: true },
      { text: ', ', bold: false, italic: false },
      { text: 'нова', bold: true, italic: true },
      { text: ', 5*5', bold: false, italic: false },
    ]);
  });

  it('strips the formatting for plain text', () => {
    expect(plainCatalogText('**Куртка:** пряма, *тепла*')).toBe('Куртка: пряма, тепла');
    expect(plainCatalogText('Без форматування')).toBe('Без форматування');
  });
});

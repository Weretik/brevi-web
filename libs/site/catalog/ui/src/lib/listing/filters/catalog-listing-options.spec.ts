import { bandLabel, catalogListingOptions } from './catalog-listing-options';
import { getCatalogDictionary } from '../../i18n/catalog-dictionary';

const text = getCatalogDictionary('uk').listing;

describe('catalog listing options', () => {
  it('names a price range by its open or closed ends', () => {
    expect(bandLabel({ key: 'a', min: null, max: 500 }, text)).toMatch(/^до 500/);
    expect(bandLabel({ key: 'b', min: 1000, max: null }, text)).toMatch(/^понад 1/);
    expect(bandLabel({ key: 'c', min: 500, max: 1000 }, text)).toContain(' – ');
  });

  it('starts every filter with «any» and offers each sort', () => {
    const options = catalogListingOptions(text, {
      bands: [{ key: 'a', min: null, max: 500 }],
      fabrics: ['Саржа'],
      types: ['Sewing', 'Ppe'],
    });

    expect(options.bands.map((option) => option.value)).toEqual([null, 'a']);
    expect(options.fabrics).toEqual([
      { value: null, label: text.any },
      { value: 'Саржа', label: 'Саржа' },
    ]);
    expect(options.types.map((option) => option.label)).toEqual([
      text.anyType,
      text.types.Sewing,
      text.types.Ppe,
    ]);
    expect(options.sorts.map((option) => option.value)).toEqual(['default', 'cheap', 'expensive']);
  });
});

import { localizedPath, localizedPaths, stripLocale, switchLocalePath } from './localized-path';

describe('localized paths', () => {
  it('builds paths without a trailing slash', () => {
    expect(localizedPath('uk')).toBe('/uk');
    expect(localizedPath('ru', '/catalog/products/')).toBe('/ru/catalog/products');
    expect(localizedPath('uk', 'contacts?tab=map')).toBe('/uk/contacts');
  });

  it('strips only a supported locale prefix', () => {
    expect(stripLocale('/ru/contacts')).toBe('/contacts');
    expect(stripLocale('/uk')).toBe('/');
    expect(stripLocale('/en/contacts')).toBe('/en/contacts');
  });

  it('switches the language of the same page', () => {
    expect(switchLocalePath('/uk/product/kostium-impuls', 'ru')).toBe('/ru/product/kostium-impuls');
    expect(switchLocalePath('/ru', 'uk')).toBe('/uk');
  });

  it('lists the page in every locale', () => {
    expect(localizedPaths('/order-in-bulk')).toEqual({
      uk: '/uk/order-in-bulk',
      ru: '/ru/order-in-bulk',
    });
  });
});

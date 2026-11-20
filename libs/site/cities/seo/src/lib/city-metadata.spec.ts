import { buildCityMetadata, citySitemapPages } from './city-metadata';

describe('city page metadata', () => {
  it('gives the page its own title, a self canonical and both languages', () => {
    const uk = buildCityMetadata('workwear', 'odesa', 'uk');
    const ru = buildCityMetadata('workwear', 'odesa', 'ru');

    expect(uk.title).toBe('Робочий одяг в Одесі: спецодяг і ЗІЗ');
    expect(ru.title).toBe('Рабочая одежда в Одессе: спецодежда и СИЗ');
    expect(uk.alternates?.canonical).toBe('/uk/workwear/odesa');
    expect(uk.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/workwear/odesa',
      'ru-UA': '/ru/workwear/odesa',
    });
    expect(uk.description).not.toBe(buildCityMetadata('sewing', 'odesa', 'uk').description);
  });

  it('lists 26 pages for the sitemap', () => {
    const paths = citySitemapPages().map((page) => page.path);
    expect(paths).toHaveLength(26);
    expect(paths).toContain('/sewing/kharkiv');
    expect(paths).toContain('/workwear/bila-tserkva');
  });
});

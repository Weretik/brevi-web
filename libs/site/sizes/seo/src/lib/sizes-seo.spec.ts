import { SIZES_SEO_TEXT, buildSizesMetadata } from './sizes-metadata';

describe('buildSizesMetadata', () => {
  it('sets title, self canonical and both language alternates', () => {
    const metadata = buildSizesMetadata('uk');

    expect(metadata.title).toBe(SIZES_SEO_TEXT.uk.title);
    expect(metadata.alternates?.canonical).toBe('/uk/size-chart');
    expect(metadata.alternates?.languages).toMatchObject({
      'ru-UA': '/ru/size-chart',
    });
  });
});

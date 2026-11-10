import { REQUEST_SEO_TEXT, buildRequestMetadata } from './request-metadata';

describe('request metadata', () => {
  it('gives each language its own title and canonical', () => {
    const uk = buildRequestMetadata('uk');
    const ru = buildRequestMetadata('ru');

    expect(uk.title).toBe(REQUEST_SEO_TEXT.uk.title);
    expect(ru.title).toBe(REQUEST_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/request');
    expect(ru.alternates?.canonical).toBe('/ru/request');
  });

  it('is never indexed', () => {
    expect(buildRequestMetadata('uk').robots).toMatchObject({ index: false });
  });
});

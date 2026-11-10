import { createSiteConfig } from './site-config';

describe('createSiteConfig', () => {
  it('uses production origins and keeps indexing off by default', () => {
    expect(createSiteConfig({})).toEqual({
      siteUrl: 'https://brevi.com.ua',
      apiUrl: 'https://api.brevi.com.ua',
      environment: 'development',
      indexingEnabled: false,
    });
  });

  it('trims trailing slashes from configured origins', () => {
    const config = createSiteConfig({
      SITE_URL: 'https://preview.example.com/',
      BREVI_API_URL: 'http://localhost:5000//',
    });

    expect(config.siteUrl).toBe('https://preview.example.com');
    expect(config.apiUrl).toBe('http://localhost:5000');
  });

  it('enables indexing only in production with the explicit flag', () => {
    expect(
      createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' }).indexingEnabled,
    ).toBe(true);
    expect(createSiteConfig({ SITE_ENV: 'production' }).indexingEnabled).toBe(false);
    expect(createSiteConfig({ SITE_ENV: 'preview', SITE_INDEXING: 'true' }).indexingEnabled).toBe(
      false,
    );
  });
});

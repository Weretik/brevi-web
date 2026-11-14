import { describe, expect, it } from 'vitest';

import { EMPTY_SITE_SETTINGS, mapSiteSettings } from './site-settings-loader';

describe('mapSiteSettings', () => {
  it('reads the settings of «Налаштування SEO сайту»', () => {
    expect(
      mapSiteSettings({
        googleAnalyticsId: 'G-AB12CD34EF',
        googleTagManagerId: null,
        googleSiteVerification: 'abcDEF_123',
        bingSiteVerification: ' ',
        defaultOgImage: { url: 'https://cdn.test/share.jpg', width: 1200, height: 630 },
      }),
    ).toEqual({
      googleAnalyticsId: 'G-AB12CD34EF',
      googleTagManagerId: null,
      googleSiteVerification: 'abcDEF_123',
      bingSiteVerification: null,
      sharePicture: { url: 'https://cdn.test/share.jpg', width: 1200, height: 630 },
    });
  });

  it('keeps empty settings empty and drops a picture that is not https', () => {
    expect(mapSiteSettings({})).toEqual(EMPTY_SITE_SETTINGS);
    expect(mapSiteSettings({ defaultOgImage: { url: 'javascript:x' } }).sharePicture).toBeNull();
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapSiteSettings(null)).toThrow();
    expect(() => mapSiteSettings({ googleAnalyticsId: 5 })).toThrow();
  });
});

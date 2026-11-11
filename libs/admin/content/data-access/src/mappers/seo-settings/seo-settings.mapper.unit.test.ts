import { describe, expect, it } from 'vitest';

import { mapSeoSettings } from './seo-settings.mapper';

describe('mapSeoSettings', () => {
  it('maps empty settings before the first save', () => {
    expect(mapSeoSettings({ revision: 0 })).toMatchObject({
      googleAnalyticsId: null,
      defaultOgImage: null,
      revision: 0,
      updatedBy: null,
    });
  });

  it('maps the picture and refuses a broken one', () => {
    const settings = mapSeoSettings({
      googleAnalyticsId: 'G-ABC1234',
      defaultOgImage: { photoId: 7, url: 'https://cdn.test/7.jpg', width: 1200, height: 630 },
      revision: 2,
      updatedAtUtc: '2026-11-11T08:00:00Z',
      updatedBy: 'admin@brevi.test',
    });
    expect(settings.defaultOgImage?.width).toBe(1200);
    expect(() => mapSeoSettings({ revision: 1, defaultOgImage: { url: 1 } })).toThrow();
  });
});

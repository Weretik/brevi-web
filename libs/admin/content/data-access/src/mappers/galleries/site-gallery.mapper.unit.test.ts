import { describe, expect, it } from 'vitest';

import { mapSiteGallery, mapSiteGalleryTransfer } from './site-gallery.mapper';

const gallery = {
  key: 'certificates',
  items: [
    {
      photoId: null,
      legacyPath: '/assets/certificates/a.webp',
      url: 'https://site.test/assets/certificates/a.webp',
      thumbnailUrl: 'https://site.test/assets/certificates/a-thumb.webp',
      width: 400,
      height: 560,
      missing: false,
      title: { uk: 'Сертифікат', ru: null },
      note: { uk: '', ru: '' },
      standards: ['ДСТУ EN ISO 13688'],
    },
  ],
  legacyCount: 1,
  revision: 2,
  updatedAtUtc: '2026-11-11T00:00:00Z',
  updatedBy: 'Дані сайту',
};

describe('site gallery mapper', () => {
  it('maps the list and an empty Russian text', () => {
    const mapped = mapSiteGallery(gallery);
    expect(mapped.kind).toBe('certificates');
    expect(mapped.items[0].title).toEqual({ uk: 'Сертифікат', ru: '' });
    expect(mapped.items[0].legacyPath).toBe('/assets/certificates/a.webp');
    expect(mapped.legacyCount).toBe(1);
  });

  it('maps a transfer step and refuses an unknown page', () => {
    expect(
      mapSiteGalleryTransfer({ moved: 1, left: 0, problems: [], gallery }).gallery.revision,
    ).toBe(2);
    expect(() => mapSiteGallery({ ...gallery, key: 'blog' })).toThrow();
  });
});

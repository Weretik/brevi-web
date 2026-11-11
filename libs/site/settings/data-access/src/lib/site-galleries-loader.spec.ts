import { describe, expect, it } from 'vitest';

import { galleryText, mapSiteGalleries } from './site-galleries-loader';

const picture = (url: string) => ({
  url,
  thumbnailUrl: `${url}-thumb`,
  width: 400,
  height: null,
  title: { uk: ' Сертифікат ', ru: '' },
  note: { uk: '', ru: '' },
  standards: ['ДСТУ EN ISO 13688', ' '],
});

describe('mapSiteGalleries', () => {
  it('keeps library and site pictures and drops unsafe addresses', () => {
    const galleries = mapSiteGalleries({
      works: [picture('https://cdn.test/1.jpg'), picture('javascript:alert(1)')],
      certificates: [picture('/assets/certificates/type-general.webp')],
    });

    expect(galleries.works).toHaveLength(1);
    expect(galleries.works[0]).toMatchObject({ width: 400, height: null });
    expect(galleries.certificates[0].title).toEqual({ uk: 'Сертифікат', ru: '' });
    expect(galleries.certificates[0].standards).toEqual(['ДСТУ EN ISO 13688']);
  });

  it('refuses another shape and shows Ukrainian text for an empty Russian one', () => {
    expect(() => mapSiteGalleries({ works: null })).toThrow();
    expect(galleryText({ uk: 'Халат', ru: '' }, 'ru')).toBe('Халат');
    expect(galleryText({ uk: 'Халат', ru: 'Халат рус' }, 'ru')).toBe('Халат рус');
  });
});

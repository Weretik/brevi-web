import { describe, expect, it } from 'vitest';

import {
  applySiteGalleryItemForm,
  moveSiteGalleryItem,
  siteGalleryInputOf,
  siteGalleryItemFormOf,
  validateSiteGalleryItem,
} from './site-gallery-validation';

import type { SiteGallery, SiteGalleryItem } from '../../entities/galleries/site-gallery';

const legacy: SiteGalleryItem = {
  photoId: null,
  legacyPath: '/assets/certificates/a.webp',
  url: 'https://site.test/assets/certificates/a.webp',
  thumbnailUrl: null,
  width: 400,
  height: 560,
  missing: false,
  title: { uk: 'Сертифікат', ru: '' },
  note: { uk: '', ru: '' },
  standards: ['ДСТУ EN ISO 13688'],
};

describe('site gallery form', () => {
  it('needs a Ukrainian title only for a certificate and checks the standards', () => {
    const empty = { titleUk: ' ', titleRu: '', noteUk: '', noteRu: '', standards: '' };
    expect(validateSiteGalleryItem('certificates', empty).titleUk).toBe(
      'Вкажіть назву документа українською.',
    );
    expect(validateSiteGalleryItem('works', empty)).toEqual({});
    expect(
      validateSiteGalleryItem('works', { ...empty, standards: Array(11).fill('ДСТУ').join('\n') })
        .standards,
    ).toBe('Не більше 10 рядків.');
  });

  it('keeps a site file by its path and drops empty texts on save', () => {
    const form = siteGalleryItemFormOf(legacy);
    const edited = applySiteGalleryItemForm(legacy, {
      ...form,
      noteUk: ' Костюми ',
      standards: 'ДСТУ EN ISO 13688\n\n ДСТУ 4048 ',
    });
    const gallery: SiteGallery = {
      kind: 'certificates',
      items: [legacy],
      legacyCount: 1,
      revision: 3,
      updatedAtUtc: null,
      updatedBy: null,
    };
    expect(siteGalleryInputOf(gallery, [edited])).toEqual({
      kind: 'certificates',
      revision: 3,
      items: [
        {
          photoId: null,
          legacyPath: '/assets/certificates/a.webp',
          title: { uk: 'Сертифікат', ru: '' },
          note: { uk: 'Костюми', ru: '' },
          standards: ['ДСТУ EN ISO 13688', 'ДСТУ 4048'],
        },
      ],
    });
  });

  it('moves a picture inside the list only', () => {
    expect(moveSiteGalleryItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    expect(moveSiteGalleryItem(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
  });
});

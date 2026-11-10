import { existsSync } from 'node:fs';
import path from 'node:path';

import { render, screen } from '@testing-library/react';

import { WORK_PHOTOS, workPhotoPath, workThumbPath } from './data/work-photos';
import { getWorksDictionary } from './i18n/works-dictionary';
import { WorksGallery } from './sections/works-gallery';

const publicDir = path.join(import.meta.dirname, '../../../../../../apps/site/public');

const shape = (value: unknown): unknown => {
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('works dictionary', () => {
  it('has the same keys in both languages', () => {
    expect(shape(getWorksDictionary('ru'))).toEqual(shape(getWorksDictionary('uk')));
  });
});

describe('work photos', () => {
  it('lists unique photos whose files exist in the site public folder', () => {
    expect(new Set(WORK_PHOTOS.map((photo) => photo.id)).size).toBe(WORK_PHOTOS.length);
    for (const photo of WORK_PHOTOS) {
      expect(existsSync(path.join(publicDir, workPhotoPath(photo)))).toBe(true);
      expect(existsSync(path.join(publicDir, workThumbPath(photo)))).toBe(true);
    }
  });
});

describe('WorksGallery', () => {
  it('links each thumbnail to its large photo and loads the tail lazily', () => {
    const photos = WORK_PHOTOS.slice(0, 6);
    render(<WorksGallery photos={photos} dictionary={getWorksDictionary('uk').gallery} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6);
    expect(images[0].getAttribute('alt')).toBe('Робочий одяг Brevi, приклад роботи 1');
    expect(images[0].getAttribute('loading')).toBe('eager');
    expect(images[5].getAttribute('loading')).toBe('lazy');
    const links = screen.getAllByRole('link');
    expect(links[0].getAttribute('href')).toBe('/assets/works/work-001.webp');
    expect(links[0].getAttribute('target')).toBe('_blank');
  });
});

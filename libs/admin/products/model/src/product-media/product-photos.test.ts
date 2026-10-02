import { describe, expect, it } from 'vitest';

import { addReadyPhoto, removePhoto, setMainPhoto } from './product-photos';

import type { ProductMedia } from './product-media';

const media = { id: 4, originalFileName: 'photo.png', status: 'Ready' } as ProductMedia;

describe('product photo links', () => {
  it('adds only a new Ready file and marks the first photo as main', () => {
    const photos = addReadyPhoto([], media);
    expect(photos).toMatchObject([{ mediaFileId: 4, isMain: true, sortOrder: 0 }]);
    expect(addReadyPhoto(photos, media)).toBe(photos);
    expect(addReadyPhoto(photos, { ...media, id: 5, status: 'PendingUpload' })).toBe(photos);
  });

  it('keeps one main photo after selection and removal', () => {
    const first = addReadyPhoto([], media);
    const second = addReadyPhoto(first, { ...media, id: 5 });
    expect(setMainPhoto(second, 1).map((photo) => photo.isMain)).toEqual([false, true]);
    expect(removePhoto(second, 0)).toMatchObject([{ mediaFileId: 5, isMain: true, sortOrder: 0 }]);
  });
});

import { describe, expect, it } from 'vitest';

import { mapProductPhotos } from './product-photos.mapper';
import { parseProductPhotoList } from '../../validators/product-photos/validate-product-photos';

describe('product photos response (CAT-018)', () => {
  it('orders photos by their position and keeps a missing library file', () => {
    const list = {
      productId: 7,
      photos: [
        {
          mediaFileId: 2,
          fileName: 'b.jpg',
          url: 'https://cdn/b.jpg',
          thumbnailUrl: null,
          isMain: false,
          sortOrder: 1,
          missing: false,
        },
        {
          mediaFileId: 1,
          fileName: null,
          url: null,
          thumbnailUrl: null,
          isMain: true,
          sortOrder: 0,
          missing: true,
        },
      ],
    };

    expect(mapProductPhotos(parseProductPhotoList(list)).map((photo) => photo.mediaFileId)).toEqual(
      [1, 2],
    );
    expect(mapProductPhotos(parseProductPhotoList(list))[0]).toMatchObject({
      isMain: true,
      missing: true,
    });
    expect(() => parseProductPhotoList({ productId: 7, photos: [{ mediaFileId: 'x' }] })).toThrow();
  });
});

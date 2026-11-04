import { describe, expect, it } from 'vitest';

import { mapQuoteProductPhotos } from './quote.mapper';

describe('mapQuoteProductPhotos', () => {
  it('keeps the product photos in order and leaves out files missing from the library', () => {
    const photo = (mediaFileId: number, missing: boolean, isMain = false) => ({
      mediaFileId,
      fileName: null,
      url: missing ? null : `https://cdn/${mediaFileId}.jpg`,
      thumbnailUrl: null,
      isMain,
      sortOrder: mediaFileId,
      missing,
    });

    expect(
      mapQuoteProductPhotos({
        productId: 3,
        photos: [photo(1, false, true), photo(2, true), photo(3, false)],
      }),
    ).toEqual([
      { mediaFileId: 1, url: 'https://cdn/1.jpg', thumbnailUrl: null, isMain: true },
      { mediaFileId: 3, url: 'https://cdn/3.jpg', thumbnailUrl: null, isMain: false },
    ]);
  });
});

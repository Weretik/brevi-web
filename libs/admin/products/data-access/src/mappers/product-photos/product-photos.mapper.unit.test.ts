import { describe, expect, it } from 'vitest';

import { mapOldSitePhotoImportReport, mapProductPhotos } from './product-photos.mapper';
import {
  parseOldSitePhotoImportReport,
  parseProductPhotoList,
} from '../../validators/product-photos/validate-product-photos';

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

  it('reads the import report and rejects an unknown status', () => {
    const report = {
      dryRun: true,
      products: 1,
      found: 0,
      modelsToCreate: 1,
      modelsCreated: 0,
      notFound: 0,
      filesToDownload: 2,
      filesDownloaded: 0,
      photosAdded: 0,
      lines: [
        {
          oldId: 537,
          oldName: 'Халат РМ',
          status: 'Create',
          productId: null,
          productName: 'Халат «РМ»',
          photosToAdd: 2,
          photosAdded: 0,
          errors: [],
        },
      ],
    };

    expect(mapOldSitePhotoImportReport(parseOldSitePhotoImportReport(report))).toEqual(report);
    expect(() =>
      parseOldSitePhotoImportReport({ ...report, lines: [{ ...report.lines[0], status: 'Done' }] }),
    ).toThrow();
  });
});

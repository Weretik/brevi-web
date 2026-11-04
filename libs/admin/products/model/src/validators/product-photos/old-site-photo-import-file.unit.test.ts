import { describe, expect, it } from 'vitest';

import { parseOldSitePhotoImportFile } from './old-site-photo-import-file';
import { addOldSitePhotoImportReports } from '../../mappers/product-photos/old-site-photo-import-report';
import { movePhoto } from '../../ordering/move-photo';

const file = {
  dryRun: true,
  baseUrl: 'https://brevi.com.ua/image/',
  products: [
    {
      oldId: 50,
      oldName: 'Костюм Агренто',
      skus: ['758', '759'],
      photos: [{ path: 'catalog/a.png', isMain: true }],
    },
    {
      oldId: 537,
      oldName: 'Халат РМ',
      skus: ['РМ-01'],
      photos: [],
      newModel: { name: 'Халат «РМ»', section: 'Одяг кухаря/пекаря', season: null },
    },
  ],
};

describe('old-site photo import file (CAT-018)', () => {
  it('reads the products and their new models', () => {
    const parsed = parseOldSitePhotoImportFile(JSON.stringify(file));

    expect(parsed?.baseUrl).toBe('https://brevi.com.ua/image/');
    expect(parsed?.products[0]?.newModel).toBeNull();
    expect(parsed?.products[1]?.newModel).toEqual({
      name: 'Халат «РМ»',
      section: 'Одяг кухаря/пекаря',
      season: null,
    });
  });

  it('refuses another file', () => {
    expect(parseOldSitePhotoImportFile('not json')).toBeNull();
    expect(parseOldSitePhotoImportFile(JSON.stringify({ products: [] }))).toBeNull();
    expect(
      parseOldSitePhotoImportFile(JSON.stringify({ ...file, products: [{ oldId: 'x' }] })),
    ).toBeNull();
  });

  it('adds up the parts of a run', () => {
    const part = {
      dryRun: false,
      products: 20,
      found: 18,
      modelsToCreate: 0,
      modelsCreated: 2,
      notFound: 0,
      filesToDownload: 40,
      filesDownloaded: 40,
      photosAdded: 41,
      lines: [],
    };

    expect(
      addOldSitePhotoImportReports(addOldSitePhotoImportReports(null, part), part),
    ).toMatchObject({
      products: 40,
      modelsCreated: 4,
      photosAdded: 82,
    });
  });

  it('moves a photo one place and keeps the list at an edge', () => {
    expect(movePhoto([1, 2, 3], 2, -1)).toEqual([1, 3, 2]);
    expect(movePhoto([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
  });
});

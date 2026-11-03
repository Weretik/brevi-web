import { describe, expect, it } from 'vitest';

import { mapMediaFileDetail, mapMediaFilePage } from './media-file.mapper';
import { mapMediaFolders } from './media-folder.mapper';
import { serializeMediaFileQuery } from '../api/media-files.api';

const file = {
  id: 41,
  fileName: 'Сумка червона.jpg',
  alt: null,
  folderId: 1,
  publicUrl: 'https://brevi-media.cdn.express/library/original/a.jpg',
  contentType: 'image/jpeg',
  sizeInBytes: 2048,
  width: null,
  height: null,
  createdAt: '2026-11-03T10:00:00+00:00',
};

describe('media mappers', () => {
  it('maps a page of photos and a photo with its usages', () => {
    expect(mapMediaFilePage({ items: [file], total: 1, page: 1, pageSize: 48 }).items[0]).toEqual(
      file,
    );
    expect(
      mapMediaFileDetail({
        file,
        usages: [{ area: 'Товари', ownerId: 7, title: 'Сумка' }],
      }).usages,
    ).toEqual([{ area: 'Товари', ownerId: 7, title: 'Сумка' }]);
  });

  it('rejects a broken response', () => {
    expect(() => mapMediaFilePage({ items: [{ ...file, publicUrl: '' }], total: 1 })).toThrow(
      'Некоректна відповідь медіатеки',
    );
    expect(() => mapMediaFolders([{ id: 0, name: 'A', parentId: null, fileCount: 0 }])).toThrow();
  });

  it('sends the folder filter only with a folder', () => {
    expect(
      serializeMediaFileQuery({
        folderId: null,
        includeSubfolders: true,
        search: '  сумка ',
        page: 2,
        pageSize: 48,
      }),
    ).toBe('search=%D1%81%D1%83%D0%BC%D0%BA%D0%B0&page=2&pageSize=48');
    expect(
      serializeMediaFileQuery({
        folderId: 3,
        includeSubfolders: false,
        search: '',
        page: 1,
        pageSize: 48,
      }),
    ).toBe('folderId=3&includeSubfolders=false&page=1&pageSize=48');
  });
});

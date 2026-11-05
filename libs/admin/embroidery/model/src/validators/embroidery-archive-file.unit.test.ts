import { describe, expect, it } from 'vitest';

import { parseEmbroideryArchiveFile } from './embroidery-archive-file';

describe('parseEmbroideryArchiveFile', () => {
  it('keeps rows with an old id', () => {
    const file = parseEmbroideryArchiveFile('[{"legacyId":"a1","name":"Поло"}]');
    expect(file.error).toBeNull();
    expect(file.rows).toEqual([{ legacyId: 'a1', name: 'Поло' }]);
  });

  it('rejects other files and an empty list', () => {
    expect(parseEmbroideryArchiveFile('не json').error).toContain('embroidery-archive.json');
    expect(parseEmbroideryArchiveFile('{"tables":{}}').error).toContain('embroidery-archive.json');
    expect(parseEmbroideryArchiveFile('[{"legacyId":" "}]').error).toContain(
      'embroidery-archive.json',
    );
    expect(parseEmbroideryArchiveFile('[]').error).toBe('У файлі немає розрахунків.');
  });
});

import { describe, expect, it } from 'vitest';

import { mapEmbroideryArchiveResult } from './embroidery-archive.mapper';

describe('mapEmbroideryArchiveResult', () => {
  it('turns missing message and number into null', () => {
    const result = mapEmbroideryArchiveResult({
      dryRun: true,
      created: 1,
      unchanged: 0,
      errors: 0,
      lines: [
        {
          legacyId: 'a1',
          name: 'Поло',
          createdAt: '2026-10-26T14:55:16Z',
          createdByName: 'Олена',
          action: 'created',
        },
      ],
    });
    expect(result.lines[0]).toMatchObject({ action: 'created', message: null, number: null });
  });
});

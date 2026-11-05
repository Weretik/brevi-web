import { describe, expect, it } from 'vitest';

import { parseWorkshopArchiveImportFile } from './workshop-archive-import-file';

describe('archive transfer file', () => {
  it('reads the lines of the old books', () => {
    const result = parseWorkshopArchiveImportFile(
      JSON.stringify([
        { kind: 'Schedule', sourceKey: 'schedule:3', sourceRow: 3, fields: [], links: [] },
      ]),
    );
    expect(result.error).toBeNull();
    expect(result.rows).toHaveLength(1);
  });

  it('names the wrong row', () => {
    expect(
      parseWorkshopArchiveImportFile(
        JSON.stringify([{ kind: 'Schedule', sourceKey: 'schedule:3', sourceRow: 3 }]),
      ).error,
    ).toBe('Рядок 1: потрібні kind, sourceKey, sourceRow, fields і links.');
    expect(parseWorkshopArchiveImportFile('[]').error).toBe('У файлі немає рядків.');
  });
});

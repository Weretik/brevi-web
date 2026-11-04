import { describe, expect, it } from 'vitest';

import { parseFabricNormImportFile, parseStaffImportFile } from './production-import-file';

describe('transfer files', () => {
  it('reads the fabric norms file in metres', () => {
    const result = parseFabricNormImportFile(
      JSON.stringify([{ modelCode: 'MOD-025', norm: { oneColor: 3.6, twoColorsMain: 3.35 } }]),
    );
    expect(result.error).toBeNull();
    expect(result.rows[0].norm).toMatchObject({ oneColor: 3.6, twoColorsAdditional: null });
  });

  it('names the wrong row', () => {
    expect(
      parseStaffImportFile(
        JSON.stringify([{ fullName: 'А', position: 'Швачка' }, { fullName: 'Б' }]),
      ).error,
    ).toBe('Рядок 2: потрібні fullName і position.');
    expect(parseFabricNormImportFile('not json').error).toBe('Файл не схожий на JSON.');
  });
});

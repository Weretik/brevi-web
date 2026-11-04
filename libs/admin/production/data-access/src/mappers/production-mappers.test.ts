import { describe, expect, it } from 'vitest';

import { mapFabricNormRows } from './fabric-norm.mapper';
import { mapFabricNormImportResult } from './production-import.mapper';
import { mapWorkshopStaff } from './workshop-employee.mapper';

describe('production response mappers', () => {
  it('maps a norm row and a model without a norm', () => {
    const rows = mapFabricNormRows([
      {
        modelCode: 'MOD-025',
        modelName: 'Куртка',
        modelIsActive: true,
        norm: {
          oneColor: 3.6,
          twoColorsMain: 3.35,
          twoColorsAdditional: 0.25,
          threeColorsMain: null,
          threeColorsAdditional1: null,
          threeColorsAdditional2: null,
        },
        twoColorsTotal: 3.6,
        threeColorsTotal: null,
        updatedAt: '2026-11-04T10:00:00Z',
        problem: null,
      },
      { modelCode: 'MOD-030', modelName: 'Жилет', modelIsActive: false, norm: null },
    ]);
    expect(rows[0].norm?.twoColorsAdditional).toBe(0.25);
    expect(rows[1]).toMatchObject({ norm: null, updatedAt: null, problem: null });
  });

  it('rejects a worker without a name', () => {
    expect(() =>
      mapWorkshopStaff([
        {
          id: 1,
          fullName: ' ',
          position: 'Швачка',
          isActive: true,
          updatedAt: '2026-11-04T10:00:00Z',
        },
      ]),
    ).toThrow('Некоректна відповідь цеху');
  });

  it('keeps the error of an import line', () => {
    const result = mapFabricNormImportResult({
      dryRun: true,
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 1,
      lines: [
        { modelCode: 'MOD-404', modelName: null, action: 'error', error: 'Модель не знайдено.' },
      ],
    });
    expect(result.lines[0]).toEqual({
      key: 'MOD-404',
      detail: null,
      action: 'error',
      error: 'Модель не знайдено.',
    });
  });
});

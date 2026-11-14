import { describe, expect, it } from 'vitest';

import { mapFabricNormImportResult } from './production-import.mapper';
import { mapFabricNormRows } from '../norms/fabric-norm.mapper';
import { mapModelCompositions } from '../norms/model-composition.mapper';
import { mapWorkshopStaff } from '../people/workshop-employee.mapper';

describe('production response mappers', () => {
  it('maps a norm row and a model without a norm', () => {
    const rows = mapFabricNormRows([
      {
        modelCode: 'MOD-025',
        modelName: 'Куртка',
        modelIsActive: true,
        productId: 12,
        season: 'Літо',
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
    expect(rows[0]).toMatchObject({ productId: 12, season: 'Літо' });
    expect(rows[1]).toMatchObject({ norm: null, updatedAt: null, problem: null, productId: null });
  });

  it('maps a model composition with its layers', () => {
    const [model] = mapModelCompositions([
      {
        modelCode: 'MOD-052',
        modelName: 'Куртка «Віол»',
        productId: 52,
        season: 'Зима',
        modelIsActive: true,
        layers: [
          {
            purpose: 'Підкладка',
            code: 'FUR-021',
            name: 'Підкладка',
            quantity: 1.9,
            unit: 'Metre',
          },
        ],
        lines: [
          {
            kind: 'Fabric',
            article: '386',
            code: 'FAB-023',
            name: 'Грета',
            quantity: 2.5,
            unit: 'Metre',
            comment: null,
          },
        ],
      },
    ]);
    expect(model.layers[0]).toMatchObject({ purpose: 'Підкладка', quantity: 1.9, unit: 'Metre' });
    expect(model.lines[0]).toMatchObject({ kind: 'Fabric', article: '386' });
  });

  it('rejects a composition line of an unknown unit', () => {
    expect(() =>
      mapModelCompositions([
        {
          modelCode: 'MOD-052',
          modelName: 'Куртка',
          productId: null,
          season: null,
          modelIsActive: true,
          layers: [],
          lines: [
            {
              kind: 'Fabric',
              article: null,
              code: null,
              name: null,
              quantity: 1,
              unit: 'Yard',
              comment: null,
            },
          ],
        },
      ]),
    ).toThrow();
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

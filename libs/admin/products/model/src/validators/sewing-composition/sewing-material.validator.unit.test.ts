import { describe, expect, it } from 'vitest';

import { validateSewingMaterials } from './sewing-material.validator';
import { emptySewingMaterial } from '../../queries/sewing-composition/sewing-material-defaults';

describe('Material draft validation', () => {
  it('requires a reference for physical materials and a cost code for OtherCost', () => {
    const materials = [
      emptySewingMaterial('Fabric', 'fabric', 0),
      emptySewingMaterial('OtherCost', 'cost', 1),
    ];
    expect(validateSewingMaterials(materials, 'Model')).toEqual({
      'modelMaterials.0.referenceId': 'Оберіть позицію з довідника.',
      'modelMaterials.1.costCode': 'Вкажіть код витрати.',
    });
  });
});

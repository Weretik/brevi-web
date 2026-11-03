import { describe, expect, it } from 'vitest';

import { validateSewingMaterialResponse } from './validate-sewing-material-response';

const line = (kind: string, unit: string) => ({
  id: 1,
  articleId: null,
  scope: 'Model',
  kind,
  referenceId: kind === 'OtherCost' ? null : 5,
  costCode: kind === 'OtherCost' ? 'PACK' : null,
  unit,
  quantity: 0.5,
  sortOrder: 0,
  comment: null,
});

describe('sewing material response', () => {
  it('accepts an accessory counted in metres, as the sheet does for tape', () => {
    expect(validateSewingMaterialResponse(line('Accessory', 'Metre'), null)).toBeTruthy();
    expect(validateSewingMaterialResponse(line('Accessory', 'Piece'), null)).toBeTruthy();
  });

  it('rejects a fabric not in metres', () => {
    expect(() => validateSewingMaterialResponse(line('Fabric', 'Piece'), null)).toThrow();
  });
});

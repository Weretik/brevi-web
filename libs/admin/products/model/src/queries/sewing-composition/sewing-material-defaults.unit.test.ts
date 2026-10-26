import { describe, expect, it } from 'vitest';

import { materialUnitForKind } from './sewing-material-defaults';

describe('Material default unit policy', () => {
  it('chooses the supported unit for each material kind', () => {
    expect(materialUnitForKind('Fabric')).toBe('Metre');
    expect(materialUnitForKind('Accessory')).toBe('Piece');
    expect(materialUnitForKind('OtherCost')).toBe('Service');
  });
});

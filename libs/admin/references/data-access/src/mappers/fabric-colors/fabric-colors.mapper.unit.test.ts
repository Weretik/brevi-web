import { describe, expect, it } from 'vitest';

import { mapFabricColors } from './fabric-colors.mapper';
import { parseFabricColorsResponse } from '../../validators/fabric-colors/fabric-colors-response';

describe('fabric colours response', () => {
  it('maps a valid list', () => {
    const rows = parseFabricColorsResponse([
      { id: 18, name: 'Темно-синій кол.1076', isActive: true, sortOrder: 18 },
    ]);
    expect(mapFabricColors(rows)).toEqual([
      { id: 18, name: 'Темно-синій кол.1076', isActive: true, sortOrder: 18 },
    ]);
  });

  it('rejects a row without a name', () => {
    expect(() => parseFabricColorsResponse([{ id: 1, isActive: true, sortOrder: 1 }])).toThrow(
      'Некоректний запис кольору.',
    );
  });
});

import { describe, expect, it } from 'vitest';

import { findStockPair, searchFabricStock, stockColorKey } from './fabric-stock-search';

import type { FabricStockFabric } from '../../entities/stock/fabric-stock';

const fabric: FabricStockFabric = {
  fabricCode: 'FAB-023',
  codes: ['FAB-023', 'FAB-067'],
  fabricName: 'Грета',
  composition: '53% бавовна',
  density: '220',
  meters: 10,
  colors: [
    { color: 'Темно-синій', colorKey: 'темно-синій', meters: 4, version: 'a', sources: [] },
    { color: 'Чорний', colorKey: 'чорний', meters: 6, version: 'b', sources: [] },
  ],
};

describe('stock search', () => {
  it('normalises colours like the server', () => {
    expect(stockColorKey('  Темно   Синій ')).toBe('темно синій');
  });

  it('keeps every colour when the fabric matches and only matching colours otherwise', () => {
    expect(searchFabricStock([fabric], 'грета')[0]?.colors).toHaveLength(2);
    expect(searchFabricStock([fabric], 'fab-067')[0]?.colors).toHaveLength(2);
    expect(searchFabricStock([fabric], 'ЧОРНИЙ')[0]?.colors.map((x) => x.color)).toEqual([
      'Чорний',
    ]);
    expect(searchFabricStock([fabric], 'грета червоний')).toEqual([]);
  });

  it('finds a pair by any code of the group', () => {
    expect(findStockPair([fabric], 'FAB-067', 'чорний')?.color.meters).toBe(6);
    expect(findStockPair([fabric], 'FAB-067', 'білий')).toBeNull();
  });
});

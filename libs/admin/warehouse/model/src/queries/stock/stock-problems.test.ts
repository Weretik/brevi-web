import { describe, expect, it } from 'vitest';

import {
  filterFabricStock,
  sortFabricStock,
  stockProblemCounts,
  stockSuppliers,
} from './stock-problems';
import { stockLastMovementLabel } from '../../mappers/stock/stock-last-movement';

import type { FabricStockColor, FabricStockFabric } from '../../entities/stock/fabric-stock';

const color = (name: string, meters: number, booked = 0, toOrder = 0): FabricStockColor => ({
  color: name,
  colorKey: name.toLowerCase(),
  meters,
  version: 'v',
  sources: [],
  booked,
  free: meters - booked,
  toOrder,
  lastMovement: null,
  bookings: [],
});

const fabric = (
  code: string,
  name: string,
  supplier: string | null,
  colors: FabricStockColor[],
): FabricStockFabric => ({
  fabricCode: code,
  codes: [code],
  fabricName: name,
  composition: null,
  density: null,
  meters: colors.reduce((sum, x) => sum + x.meters, 0),
  colors,
  supplier,
  booked: colors.reduce((sum, x) => sum + x.booked, 0),
  free: colors.reduce((sum, x) => sum + x.free, 0),
});

const fabrics = [
  fabric('FAB-023', 'Грета', 'Черкаси', [
    color('Синій', 84.5, 35.2),
    color('Хакі', 12.3, 18, 5.7),
    color('Червоний', -2),
    color('Чорний', 0.4),
  ]),
  fabric('FAB-041', 'Тиса', 'Тексика', [color('Білий', 210.5, 40)]),
];

describe('stock problems', () => {
  it('counts each chip and keeps only the pairs with the problem', () => {
    expect(stockProblemCounts(fabrics)).toEqual({ all: 5, negative: 1, short: 1, low: 1 });
    expect(
      filterFabricStock(fabrics, 'short', null).flatMap((x) => x.colors.map((c) => c.color)),
    ).toEqual(['Хакі']);
    expect(filterFabricStock(fabrics, 'all', 'Тексика').map((x) => x.fabricCode)).toEqual([
      'FAB-041',
    ]);
    expect(stockSuppliers(fabrics)).toEqual(['Тексика', 'Черкаси']);
  });

  it('sorts fabrics by their totals and colours inside', () => {
    const byMeters = sortFabricStock(fabrics, 'meters', true);
    expect(byMeters.map((x) => x.fabricCode)).toEqual(['FAB-041', 'FAB-023']);
    expect(byMeters[1]?.colors.map((x) => x.color)).toEqual([
      'Синій',
      'Хакі',
      'Чорний',
      'Червоний',
    ]);
    expect(sortFabricStock(fabrics, 'free', false)[0]?.colors[0]?.color).toBe('Хакі');
    expect(sortFabricStock(fabrics, 'name', false).map((x) => x.fabricName)).toEqual([
      'Грета',
      'Тиса',
    ]);
  });

  it('names the latest movement', () => {
    const last = {
      id: 1,
      kind: 'Issue' as const,
      operationDate: '2026-11-11',
      delta: -26.4,
      orderNumber: 14,
      document: null,
      supplierName: null,
      destination: null,
    };
    expect(stockLastMovementLabel(last)).toBe('Ц-14 · 11.11');
    expect(
      stockLastMovementLabel({ ...last, kind: 'Receipt', orderNumber: null, document: 'ВН-3201' }),
    ).toBe('прихід ВН-3201 · 11.11');
    expect(stockLastMovementLabel({ ...last, kind: 'Adjustment', orderNumber: null })).toBe(
      'уточнення · 11.11',
    );
  });
});

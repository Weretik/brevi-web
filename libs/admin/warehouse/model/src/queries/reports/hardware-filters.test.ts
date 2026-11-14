import { describe, expect, it } from 'vitest';

import { filterHardware, hardwareTasks, hardwareViewCounts } from './hardware-filters';

import type { HardwareNeed } from '../../entities/reports/stock-reports';

const need = (
  code: string,
  dueDate: string | null,
  extra: Partial<HardwareNeed> = {},
): HardwareNeed => ({
  code,
  name: `Назва ${code}`,
  nameChecked: true,
  note: null,
  unit: 'Piece',
  quantity: 6,
  orders: [
    {
      orderId: 1,
      orderNumber: 12,
      clientName: 'Геофізика',
      itemId: 10,
      modelName: 'Куртка',
      norm: 3,
      products: 2,
      quantity: 6,
      dueDate,
    },
  ],
  dueDate,
  ...extra,
});

const needs = [
  need('FUR-003', null),
  need('FUR-001', '2026-11-20'),
  need('FUR-002', '2026-11-14', { nameChecked: false, name: 'FUR-002', note: 'чорна' }),
];

describe('filterHardware', () => {
  it('sorts by the nearest due date, undated last', () => {
    expect(filterHardware(needs, 'all', '').map((x) => x.code)).toEqual([
      'FUR-002',
      'FUR-001',
      'FUR-003',
    ]);
  });

  it('finds by code, note, client or task number', () => {
    expect(filterHardware(needs, 'all', 'fur-001').map((x) => x.code)).toEqual(['FUR-001']);
    expect(filterHardware(needs, 'all', 'чорн').map((x) => x.code)).toEqual(['FUR-002']);
    expect(filterHardware(needs, 'all', 'Ц-12')).toHaveLength(3);
    expect(filterHardware(needs, 'all', 'гео')).toHaveLength(3);
  });

  it('«Назву не знайдено» keeps the unchecked names', () => {
    expect(filterHardware(needs, 'unchecked', '').map((x) => x.code)).toEqual(['FUR-002']);
    expect(
      hardwareViewCounts({ orders: 1, items: 1, needs, incomplete: [], calculatedAt: '' }),
    ).toEqual({ all: 3, incomplete: 0, unchecked: 1 });
  });
});

describe('hardwareTasks', () => {
  it('counts distinct orders of a need', () => {
    const base = need('F-1', null);
    const twoRowsOneOrder = {
      ...base,
      orders: [base.orders[0], { ...base.orders[0], itemId: 11 }],
    };
    const twoOrders = { ...base, orders: [base.orders[0], { ...base.orders[0], orderId: 2 }] };

    expect(hardwareTasks(twoRowsOneOrder)).toBe(1);
    expect(hardwareTasks(twoOrders)).toBe(2);
  });
});

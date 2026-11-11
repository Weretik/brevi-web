import { describe, expect, it } from 'vitest';

import {
  createFabricIssueValues,
  fabricIssueBody,
  hasFabricIssueErrors,
  parseStockMeters,
  stockColorKey,
  validateFabricIssue,
} from './fabric-stock-forms';

import type { ProductionItemFabric } from '../entities/fabric-stock';

const fabric: ProductionItemFabric = {
  orderId: 5,
  itemId: 3,
  orderVersion: 2,
  fabricCode: 'FAB-1',
  fabricName: 'Оксфорд',
  quantity: 10,
  hasNorm: true,
  plan: [
    {
      fabricCode: 'FAB-1',
      color: 'Чорний',
      colorKey: 'чорний',
      planned: 15,
      covered: 5,
      issued: 5,
      reserved: 10.5,
      stockId: 1,
      stockMeters: 20,
      stockAvailable: 9.5,
    },
    {
      fabricCode: 'FAB-1',
      color: 'Синій',
      colorKey: 'синій',
      planned: 2,
      covered: 2,
      issued: 2,
      reserved: 0,
      stockId: 2,
      stockMeters: 1,
      stockAvailable: 1,
    },
  ],
  issued: 7,
  issues: [],
  canIssue: true,
};

describe('fabric stock forms', () => {
  it('reads metres with a comma and two decimals at most', () => {
    expect(parseStockMeters('12,5')).toBe(12.5);
    expect(parseStockMeters('1.255')).toBeNull();
    expect(parseStockMeters('abc')).toBeNull();
    expect(stockColorKey('  Темно   Синій ')).toBe('темно синій');
  });

  it('starts an issue with what is still reserved and keeps planned lines on the plan', () => {
    const values = createFabricIssueValues(fabric, 4, '2026-11-04');
    expect(values.lines).toHaveLength(1);
    expect(values.lines[0]).toMatchObject({ purpose: 'Planned', color: 'Чорний', meters: '10,5' });
    const code = (id: number | null) => (id === 4 ? 'FAB-1' : 'FAB-2');
    expect(hasFabricIssueErrors(validateFabricIssue(values, fabric, code))).toBe(false);
    const wrong = { ...values, lines: [{ ...values.lines[0], fabricId: 9 }] };
    expect(validateFabricIssue(wrong, fabric, code).line[values.lines[0].key]?.color).toMatch(
      /Заміна/,
    );
    const extra = { ...values, lines: [{ ...values.lines[0], purpose: 'Additional' as const }] };
    expect(fabricIssueBody(extra, 2).lines[0]).toMatchObject({ planColorKey: null, meters: 10.5 });
  });
});

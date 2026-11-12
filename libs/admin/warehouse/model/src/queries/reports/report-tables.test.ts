import { describe, expect, it } from 'vitest';

import { filterConsumption } from './consumption-filters';
import { filterValuation, valuationShare, valuationViewCounts } from './valuation-filters';

import type { FabricConsumptionRow } from '../../entities/consumption/fabric-consumption';
import type { ValuationFabric } from '../../entities/reports/stock-reports';

const row = (fabricName: string, color: string, issuedToTasks: number): FabricConsumptionRow => ({
  stockId: issuedToTasks,
  fabricCode: 'FAB-023',
  fabricName,
  color,
  received: 0,
  issued: issuedToTasks,
  corrected: 0,
  issuedValue: null,
  issuedToTasks,
  oneOff: 0,
});

const fabric = (
  fabricName: string,
  value: number,
  meters: number,
  unpriced = 0,
): ValuationFabric => ({
  fabricCode: fabricName,
  fabricName,
  price: unpriced ? null : 100,
  priceFabricCode: null,
  meters,
  unpricedMeters: unpriced,
  value,
  colors: [],
});

describe('consumption table', () => {
  const rows = [
    row('Тиса', 'Хакі', 54),
    row('Грета', 'Темно-сірий', 132),
    row('Оксфорд', 'Чорний', 96.8),
  ];

  it('sorts by a column and finds by fabric or colour', () => {
    expect(filterConsumption(rows, '', 'issuedToTasks', true).map((x) => x.fabricName)).toEqual([
      'Грета',
      'Оксфорд',
      'Тиса',
    ]);
    expect(filterConsumption(rows, '', 'name', false).map((x) => x.fabricName)).toEqual([
      'Грета',
      'Оксфорд',
      'Тиса',
    ]);
    expect(filterConsumption(rows, 'хак', 'name', false).map((x) => x.color)).toEqual(['Хакі']);
  });
});

describe('valuation table', () => {
  const fabrics = [
    fabric('Грета', 16379, 148.9),
    fabric('Фліс', 0, 12, 12),
    fabric('Тиса', 34732, 210.5),
  ];

  it('sorts by value, unpriced after, and filters them', () => {
    expect(filterValuation(fabrics, 'all').map((x) => x.fabricName)).toEqual([
      'Тиса',
      'Грета',
      'Фліс',
    ]);
    expect(filterValuation(fabrics, 'unpriced').map((x) => x.fabricName)).toEqual(['Фліс']);
  });

  it('counts the chips and the share of the value', () => {
    expect(
      valuationViewCounts({
        value: 51111,
        positiveMeters: 0,
        unpricedPairs: 1,
        unpricedMeters: 12,
        isPartial: true,
        shortageMeters: 2,
        shortageValue: 220,
        fabrics,
        shortages: [
          {
            fabricCode: 'FAB-023',
            fabricName: 'Грета',
            color: 'Червоний',
            meters: 2,
            price: 110,
            value: 220,
          },
        ],
        calculatedAt: '',
        priceSource: '',
      }),
    ).toEqual({ all: 3, unpriced: 1, shortage: 1 });
    expect(valuationShare(fabrics[2] as ValuationFabric, 51111)).toBeCloseTo(0.68, 2);
    expect(valuationShare(fabrics[0] as ValuationFabric, 0)).toBe(0);
  });
});

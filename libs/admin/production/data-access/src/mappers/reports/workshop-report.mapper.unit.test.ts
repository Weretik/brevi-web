import { describe, expect, it } from 'vitest';

import { mapWorkshopDashboard, mapWorkshopReportPair } from './workshop-report.mapper';

const report = (month: string) => ({
  from: month,
  to: month,
  closedMonths: [],
  openMonths: [month],
  totals: {
    sewnPieces: 3,
    outputValue: 4500,
    unpricedPieces: 0,
    accrued: 900,
    minutes: 0,
    issuedMeters: 4,
    issuedValue: 480,
    unpricedIssuedMeters: 0,
    stockMeters: 6,
    stockValue: 720,
    unpricedStockMeters: 0,
  },
  output: [
    {
      orderId: 1,
      orderNumber: 5,
      clientName: 'Нива',
      itemId: 9,
      modelName: 'Халат',
      quantity: 3,
      unitPrice: 1500,
      value: 4500,
    },
  ],
  staff: [
    {
      employeeId: 3,
      name: 'Андреева',
      position: 'Швачка',
      minutes: 0,
      sewn: 3,
      cut: 0,
      accrued: 900,
      dayAverage: null,
    },
  ],
  materials: [
    {
      movementId: 4,
      issuedOn: '2026-11-04',
      fabricCode: 'FAB-023',
      fabricName: 'Грета',
      color: 'Сірий',
      orderId: 1,
      orderNumber: 5,
      modelName: 'Халат',
      meters: 4,
      pricePerMeter: 120,
      value: 480,
    },
  ],
  stock: [
    {
      stockId: 2,
      fabricCode: 'FAB-023',
      fabricName: 'Грета',
      color: 'Сірий',
      meters: -0.5,
      pricePerMeter: null,
      value: null,
    },
  ],
  warnings: ['Не обрано начальника цеху: його частка не нарахована.'],
});

describe('workshop report mapper', () => {
  it('reads a report with an optional comparison', () => {
    const pair = mapWorkshopReportPair({ current: report('2026-11'), comparison: null });
    expect(pair.comparison).toBeNull();
    expect(pair.current.output[0]?.value).toBe(4500);
    expect(pair.current.staff[0]?.dayAverage).toBeNull();
    expect(pair.current.stock[0]?.meters).toBe(-0.5);
    expect(
      mapWorkshopReportPair({ current: report('2026-11'), comparison: report('2026-10') })
        .comparison?.from,
    ).toBe('2026-10');
  });

  it('refuses a broken report', () => {
    expect(() =>
      mapWorkshopReportPair({ current: { ...report('2026-11'), totals: null } }),
    ).toThrow();
  });

  it('reads the overview without hours for those who do not keep them', () => {
    const dashboard = mapWorkshopDashboard({
      today: '2026-11-05',
      openOrders: 1,
      openPieces: 60,
      lateOrders: 0,
      readyOrders: 0,
      readyPieces: 0,
      stages: [{ stage: 1, label: 'Нове', orders: [] }],
      hours: null,
    });
    expect(dashboard.hours).toBeNull();
    expect(dashboard.stages[0]?.label).toBe('Нове');
  });
});

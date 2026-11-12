import { describe, expect, it } from 'vitest';

import { mapBooking, mapHardware, mapPlanFact, mapValuation } from './stock-reports.mapper';

const summary = {
  orders: 1,
  products: 3,
  planPerProduct: 2.5,
  factPerProduct: 2.3,
  differencePerProduct: -0.2,
  difference: -0.6,
  result: 'Economy',
  uncomparableItems: 0,
};

describe('stock report mappers', () => {
  it('maps «План і факт» with materials and keeps «не зафіксовано» as null', () => {
    const report = mapPlanFact({
      models: [
        {
          modelName: 'Куртка',
          modelCode: 'MOD-052',
          summary,
          items: [
            {
              orderId: 1,
              orderNumber: 12,
              clientName: 'Геофізика',
              itemId: 3,
              products: 3,
              plan: 7.5,
              fact: 6.9,
              difference: -0.6,
              result: 'Economy',
              reason: null,
              materials: [
                {
                  layer: 'Upper',
                  planFabricCode: 'FAB-023',
                  planFabricName: 'Грета',
                  planColor: 'Червоний',
                  plan: 0.9,
                  fact: null,
                  difference: null,
                  used: [],
                },
              ],
            },
          ],
        },
      ],
      total: summary,
      inProgressItems: 2,
    });
    expect(report.models[0]?.items[0]?.materials[0]?.fact).toBeNull();
    expect(report.inProgressItems).toBe(2);
    expect(() =>
      mapPlanFact({ models: [], total: { ...summary, result: 'Good' }, inProgressItems: 0 }),
    ).toThrow(/результат/);
  });

  it('maps booking, valuation and hardware', () => {
    const booking = mapBooking({
      reserved: 6,
      free: 0,
      toOrder: 5,
      pairs: [
        {
          fabricCode: 'FAB-023',
          fabricName: 'Грета',
          color: 'Синій',
          stock: 6,
          need: 11,
          reserved: 6,
          free: 0,
          toOrder: 5,
          shortage: 0,
          supplier: 'Тексика',
          needBy: '2026-11-20',
          items: [],
        },
      ],
      unknown: [],
      calculatedAt: '2026-11-11T10:00:00Z',
      canReceive: true,
    });
    expect(booking.pairs[0]).toMatchObject({ supplier: 'Тексика', needBy: '2026-11-20' });
    expect(booking.canReceive).toBe(true);
    expect(
      mapHardware({
        orders: 1,
        items: 1,
        needs: [
          {
            code: 'FUR-003',
            name: 'Кнопка',
            nameChecked: true,
            note: null,
            unit: 'Piece',
            quantity: 6,
            dueDate: '2026-11-14',
            orders: [
              {
                orderId: 1,
                orderNumber: 12,
                clientName: 'Г',
                itemId: 3,
                modelName: 'К',
                norm: 3,
                products: 2,
                quantity: 6,
                dueDate: null,
              },
            ],
          },
        ],
        incomplete: [],
        calculatedAt: '2026-11-11T10:00:00Z',
      }).needs[0],
    ).toMatchObject({ dueDate: '2026-11-14', orders: [{ dueDate: null }] });
    expect(
      mapBooking({
        reserved: 6,
        free: 0,
        toOrder: 5,
        pairs: [],
        canReceive: false,
        unknown: [
          {
            orderId: 1,
            orderNumber: 12,
            clientName: 'Г',
            itemId: 3,
            modelName: 'К',
            reason: 'Немає норми',
          },
        ],
        calculatedAt: '2026-11-11T10:00:00Z',
      }).unknown,
    ).toHaveLength(1);
    expect(
      mapValuation({
        value: 0,
        positiveMeters: 0,
        unpricedPairs: 0,
        unpricedMeters: 0,
        isPartial: false,
        shortageMeters: 0,
        shortageValue: 0,
        fabrics: [],
        shortages: [],
        calculatedAt: '2026-11-11T10:00:00Z',
        priceSource: 'Довідник',
      }).isPartial,
    ).toBe(false);
    expect(() =>
      mapHardware({ orders: 0, items: 0, needs: [], incomplete: [], calculatedAt: 'not a date' }),
    ).toThrow(/час розрахунку/);
  });
});

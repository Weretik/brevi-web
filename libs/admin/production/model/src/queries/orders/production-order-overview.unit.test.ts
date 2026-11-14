import { describe, expect, it } from 'vitest';

import { itemsWord, productionOrderOverview } from './production-order-overview';

import type { ProductionItem } from '../../entities/orders/production-order';

const item = (id: number, dueDate: string, extra: Partial<ProductionItem> = {}) =>
  ({
    id,
    position: id,
    modelName: `Модель ${id}`,
    quantity: 10,
    dueDate,
    shippedQuantity: 0,
    currentStage: 'Cutting',
    ...extra,
  }) as ProductionItem;

describe('productionOrderOverview', () => {
  const today = '2026-11-12';

  it('sums pieces and finds the due range', () => {
    const overview = productionOrderOverview(
      {
        status: 'New',
        items: [
          item(1, '2026-11-28', { shippedQuantity: 4 }),
          item(2, '2026-11-20', { quantity: 25 }),
        ],
      },
      today,
    );
    expect(overview).toMatchObject({
      itemsCount: 2,
      quantity: 35,
      shipped: 4,
      dueFrom: '2026-11-20',
      dueTo: '2026-11-28',
    });
  });

  it('marks only open items that are late or due within three days', () => {
    const overview = productionOrderOverview(
      {
        status: 'New',
        items: [
          item(1, '2026-11-10'),
          item(2, '2026-11-14'),
          item(3, '2026-11-01', { shippedQuantity: 10 }),
          item(4, '2026-11-01', { currentStage: 'Complete' }),
          item(5, '2026-11-30'),
        ],
      },
      today,
    );
    expect(overview.overdue.map((x) => [x.item.id, x.days])).toEqual([[1, 2]]);
    expect(overview.soon.map((x) => [x.item.id, x.days])).toEqual([[2, 2]]);
  });

  it('marks nothing on a closed or cancelled order', () => {
    const overview = productionOrderOverview(
      { status: 'Closed', items: [item(1, '2026-11-01')] },
      today,
    );
    expect(overview.overdue).toEqual([]);
  });

  it('declines «позиція»', () => {
    expect([1, 3, 5, 11, 22].map(itemsWord)).toEqual([
      'позиція',
      'позиції',
      'позицій',
      'позицій',
      'позиції',
    ]);
  });
});

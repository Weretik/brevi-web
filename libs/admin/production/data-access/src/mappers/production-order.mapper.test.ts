import { describe, expect, it } from 'vitest';

import { mapProductionOrder, mapProductionOrderPage } from './production-order.mapper';

const order = {
  id: 5,
  number: 12,
  status: 'New',
  clientName: 'School 5',
  quoteId: 7,
  quoteNumber: 'КП-7',
  managerName: 'Олена',
  orderDate: '2026-11-04',
  comment: null,
  priceTier: null,
  isTransferred: true,
  copiedFromOrderId: null,
  createdAt: '2026-11-04T10:00:00Z',
  createdByName: 'Олена',
  updatedAt: '2026-11-04T10:00:00Z',
  version: 1,
  permissions: {
    canEdit: true,
    canCopy: true,
    canDelete: false,
    seesSewingRate: false,
    seesReportPrice: false,
  },
  items: [
    {
      id: 3,
      position: 1,
      modelCode: 'MOD-025',
      modelName: 'Куртка',
      fabricCode: null,
      fabricName: null,
      quantity: 10,
      dueDate: '2026-11-20',
      mainColor: 'чорний',
      additionalColors: ['синій'],
      sizesText: null,
      technicalChanges: null,
      comment: null,
      applications: [{ kind: 'Embroidery', place: 'груди', description: null, color: null }],
      plannedFabricMeters: 17,
      sewingRate: null,
      reportUnitPrice: null,
    },
  ],
};

describe('production order mappers', () => {
  it('keeps prices the server hid as null', () => {
    const mapped = mapProductionOrder(order);
    expect(mapped.items[0]).toMatchObject({
      sewingRate: null,
      reportUnitPrice: null,
      applications: [{ kind: 'Embroidery', place: 'груди' }],
    });
    expect(mapped.isTransferred).toBe(true);
  });

  it('rejects an unknown status or date', () => {
    expect(() => mapProductionOrder({ ...order, status: 'Done' })).toThrow('статус');
    expect(() => mapProductionOrder({ ...order, orderDate: '04.11.2026' })).toThrow(
      'дата створення',
    );
  });

  it('maps a page with counts and managers', () => {
    const page = mapProductionOrderPage({
      items: [],
      page: 1,
      pageSize: 50,
      total: 0,
      counts: { all: 3, new: 1, closed: 2, cancelled: 0 },
      managers: ['Олена'],
    });
    expect(page.counts.closed).toBe(2);
    expect(page.managers).toEqual(['Олена']);
  });
});

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
    canTrack: false,
    canClose: false,
    canCancel: true,
    canReopen: false,
    canManageFiles: true,
    canSendTelegram: false,
  },
  cancelReason: null,
  files: [
    {
      id: 9,
      itemId: 3,
      kind: 'Sizes',
      name: 'Розміри.pdf',
      contentType: 'application/pdf',
      bytes: 1200,
      url: 'https://drive.google.com/file/d/abc',
      isOldLink: true,
      createdByName: 'Олена',
      createdAt: '2026-10-10T09:00:00Z',
    },
  ],
  telegram: {
    status: 'Sent',
    sentAt: '2026-10-10T09:05:00Z',
    sentByName: 'Старий «Цех»',
    error: null,
    ready: false,
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
      stages: ['FabricAvailable', 'Cutting'],
      currentStage: 'Cutting',
      shippedQuantity: 4,
      shipments: [
        {
          id: 1,
          quantity: 4,
          shippedOn: '2026-11-05',
          comment: null,
          createdByName: 'Начальник',
          createdAt: '2026-11-05T09:00:00Z',
        },
      ],
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

  it('maps a linked embroidery calculation and one that was removed', () => {
    const embroidery = {
      id: 42,
      number: 'ВШ-0042',
      name: 'Логотип',
      customerName: null,
      mode: 'Garment',
      quantity: 10,
      stitchesPerUnit: 8000,
      hoopLabel: '18 см',
      hoopings: 10,
      stabilizerMetres: 0.6,
      fabricMetres: null,
      mockupUrl: 'https://cdn.test/logo.png',
      mockupThumbnailUrl: null,
    };
    const item = order.items[0];
    const mapped = mapProductionOrder({
      ...order,
      items: [
        {
          ...item,
          applications: [
            {
              ...item.applications[0],
              embroideryCalculationId: 42,
              embroideryNumber: 'ВШ-0042',
              embroidery,
            },
            {
              ...item.applications[0],
              embroideryCalculationId: 7,
              embroideryNumber: 'ВШ-0007',
              embroidery: null,
            },
          ],
        },
      ],
    });
    expect(mapped.items[0].applications.map((x) => x.embroidery?.stabilizerMetres ?? null)).toEqual(
      [0.6, null],
    );
    expect(mapped.items[0].applications[1].embroideryNumber).toBe('ВШ-0007');
  });

  it('maps stages, shipments, files and the Telegram mark', () => {
    const mapped = mapProductionOrder(order);
    expect(mapped.items[0]).toMatchObject({
      currentStage: 'Cutting',
      shippedQuantity: 4,
      shipments: [{ quantity: 4, shippedOn: '2026-11-05' }],
    });
    expect(mapped.files[0]).toMatchObject({ kind: 'Sizes', isOldLink: true, itemId: 3 });
    expect(mapped.telegram.status).toBe('Sent');
    expect(() =>
      mapProductionOrder({ ...order, items: [{ ...order.items[0], currentStage: 'Done' }] }),
    ).toThrow('поточний етап');
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

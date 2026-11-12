import { describe, expect, it } from 'vitest';

import {
  mapFabricMovementHistory,
  mapFabricMovementPage,
  mapFabricStockChoices,
  mapFabricStockList,
  mapFabricStockOperation,
} from './fabric-stock.mapper';

const permissions = { canMove: true, seesValue: false, canTransfer: false };

describe('warehouse mappers', () => {
  it('maps «Залишки» with an alias group and a negative pair', () => {
    const list = mapFabricStockList({
      fabrics: [
        {
          fabricCode: 'FAB-023',
          codes: ['FAB-023', 'FAB-067'],
          fabricName: 'Грета',
          composition: '53% бавовна',
          density: null,
          meters: -1.5,
          colors: [
            {
              color: 'Синій',
              colorKey: 'синій',
              meters: -1.5,
              version: '0123456789abcdef',
              sources: [
                { id: 1, fabricCode: 'FAB-023', meters: 2 },
                { id: 2, fabricCode: 'FAB-067', meters: -3.5 },
              ],
            },
          ],
        },
      ],
      meters: -1.5,
      pairs: 1,
      negative: 1,
      permissions,
    });
    expect(list.fabrics[0]?.codes).toEqual(['FAB-023', 'FAB-067']);
    expect(list.fabrics[0]?.colors[0]?.sources[1]?.meters).toBe(-3.5);
    expect(list.negative).toBe(1);
    expect(list.fabrics[0]?.colors[0]).toMatchObject({
      booked: 0,
      free: -1.5,
      lastMovement: null,
      bookings: [],
    });
    expect(list.short).toBe(0);
  });

  it('maps the booking and the latest movement of a pair', () => {
    const list = mapFabricStockList({
      fabrics: [
        {
          fabricCode: 'FAB-023',
          codes: ['FAB-023'],
          fabricName: 'Грета',
          composition: null,
          density: null,
          meters: 12.3,
          supplier: 'Черкаси',
          booked: 18,
          free: -5.7,
          colors: [
            {
              color: 'Хакі',
              colorKey: 'хакі',
              meters: 12.3,
              version: 'v',
              sources: [],
              booked: 18,
              free: -5.7,
              toOrder: 5.7,
              lastMovement: {
                id: 9,
                kind: 'Issue',
                operationDate: '2026-11-06',
                delta: -3,
                orderNumber: 9,
                document: null,
                supplierName: null,
                destination: null,
              },
              bookings: [
                {
                  orderId: 4,
                  orderNumber: 9,
                  clientName: 'Нафтогаз',
                  modelName: 'Куртка',
                  dueDate: null,
                  need: 18,
                  toOrder: 5.7,
                },
              ],
            },
          ],
        },
      ],
      meters: 12.3,
      pairs: 1,
      negative: 0,
      permissions,
      short: 1,
    });
    expect(list.fabrics[0]).toMatchObject({ supplier: 'Черкаси', booked: 18, free: -5.7 });
    expect(list.fabrics[0]?.colors[0]?.lastMovement).toMatchObject({
      kind: 'Issue',
      orderNumber: 9,
    });
    expect(list.fabrics[0]?.colors[0]?.bookings[0]).toMatchObject({ orderNumber: 9, toOrder: 5.7 });
    expect(list.short).toBe(1);
  });

  it('maps a page of movements and refuses an unknown kind', () => {
    const row = {
      id: 7,
      stockId: 2,
      kind: 'Issue',
      operationDate: '2026-11-10',
      createdAt: '2026-11-11T08:00:00Z',
      fabricCode: 'FAB-067',
      groupCode: 'FAB-023',
      fabricName: 'Грета',
      color: 'Синій',
      supplierName: null,
      document: null,
      orderId: null,
      itemId: null,
      orderNumber: null,
      modelName: null,
      destination: 'Зразки',
      delta: -3.5,
      metersAfter: -3.5,
      note: null,
      createdByName: 'Олена',
      isReversed: false,
      reversesMovementId: null,
      canReverse: true,
      isVoided: false,
      revision: 1,
      canEdit: true,
    };
    const page = mapFabricMovementPage({ rows: [row], page: 1, hasMore: false, permissions });
    expect(page.rows[0]).toMatchObject({ groupCode: 'FAB-023', destination: 'Зразки' });
    expect(page.rows[0]?.pairMetersAfter).toBeNull();
    expect(page.counts).toBeNull();
    const counted = mapFabricMovementPage({
      rows: [{ ...row, pairMetersAfter: 6.5 }],
      page: 1,
      hasMore: false,
      permissions,
      total: 1,
      counts: {
        all: 9,
        receipt: 3,
        itemIssue: 2,
        oneOffIssue: 1,
        adjustment: 1,
        opening: 1,
        cancelled: 1,
      },
    });
    expect(counted.rows[0]?.pairMetersAfter).toBe(6.5);
    expect(counted.total).toBe(1);
    expect(counted.counts).toMatchObject({ All: 9, ItemIssue: 2, Cancelled: 1 });
    expect(() =>
      mapFabricMovementPage({
        rows: [{ ...row, kind: 'Void' }],
        page: 1,
        hasMore: false,
        permissions,
      }),
    ).toThrow();
  });

  it('maps the history of a movement and refuses an unknown action', () => {
    const state = {
      fabricCode: 'FAB-023',
      color: 'Синій',
      operationDate: '2026-11-10',
      delta: 10,
      supplierName: 'Тексика',
      document: null,
      destination: null,
      isVoided: false,
    };
    const revision = {
      id: 3,
      number: 1,
      action: 'Void',
      before: state,
      after: { ...state, delta: 0, isVoided: true },
      reason: 'Дубль',
      createdByName: 'Олена',
      createdAt: '2026-11-11T09:00:00Z',
      isUndone: false,
    };
    const history = mapFabricMovementHistory({
      movementId: 7,
      revision: 1,
      canRestore: true,
      revisions: [revision],
    });
    expect(history.revisions[0]).toMatchObject({ action: 'Void', after: { isVoided: true } });
    expect(() =>
      mapFabricMovementHistory({
        movementId: 7,
        revision: 1,
        canRestore: true,
        revisions: [{ ...revision, action: 'Delete' }],
      }),
    ).toThrow();
  });

  it('maps choices without prices and an operation result', () => {
    const choices = mapFabricStockChoices({
      fabrics: [
        {
          id: 67,
          code: 'FAB-067',
          groupCode: 'FAB-023',
          name: 'Грета',
          composition: null,
          density: null,
          supplier: 'Черкаси',
          price: null,
        },
      ],
      suppliers: ['Тексика'],
      colors: ['Синій'],
    });
    expect(choices.fabrics[0]?.groupCode).toBe('FAB-023');
    expect(
      mapFabricStockOperation({
        operationId: null,
        fabricCode: 'FAB-023',
        color: 'Синій',
        meters: 0,
        replayed: true,
      }).replayed,
    ).toBe(true);
  });
});

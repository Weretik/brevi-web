import { describe, expect, it } from 'vitest';

import {
  mapFabricStockChoices,
  mapFabricStockImportResult,
  mapFabricStockList,
  mapProductionItemFabric,
} from './fabric-stock.mapper';

describe('fabric stock mappers', () => {
  it('maps a list with a line the stock never held and hidden value', () => {
    const list = mapFabricStockList({
      rows: [
        {
          id: null,
          fabricId: null,
          fabricCode: 'FAB-2',
          fabricName: 'Фліс',
          color: 'синій',
          meters: 0,
          reserved: 4.5,
          available: -4.5,
          price: null,
          value: null,
          version: 0,
          updatedAt: null,
        },
      ],
      totals: { meters: 0, reserved: 4.5, lines: 1, short: 1, value: null },
      permissions: { canMove: false, seesValue: false },
    });
    expect(list.rows[0]).toMatchObject({ id: null, available: -4.5, value: null });
    expect(list.permissions.seesValue).toBe(false);
  });

  it('rejects an unknown issue purpose', () => {
    expect(() =>
      mapProductionItemFabric({
        orderId: 1,
        itemId: 2,
        orderVersion: 1,
        fabricCode: null,
        fabricName: null,
        quantity: 1,
        hasNorm: false,
        plan: [],
        issued: 1,
        canIssue: false,
        issues: [
          {
            id: 1,
            issuedOn: '2026-11-04',
            note: null,
            createdByName: 'Іван',
            createdAt: '2026-11-04T10:00:00Z',
            isReversed: false,
            reversedAt: null,
            reversedByName: null,
            reverseReason: null,
            lines: [
              {
                id: 1,
                purpose: 'Other',
                planColorKey: null,
                plannedMeters: null,
                stockId: 1,
                fabricCode: 'FAB-1',
                fabricName: 'Оксфорд',
                color: 'чорний',
                meters: 1,
                coveredMeters: 0,
              },
            ],
          },
        ],
      }),
    ).toThrow();
  });

  it('puts issue errors first and the reservation difference into notes', () => {
    const result = mapFabricStockImportResult({
      dryRun: true,
      created: 1,
      unchanged: 0,
      errors: 1,
      movements: 3,
      issues: 0,
      reservationDifferences: 2,
      lines: [
        { fabricCode: 'FAB-1', color: 'чорний', movements: 3, action: 'created', error: null },
      ],
      issueErrors: ['Видача 7: завдання не перенесено.'],
    });
    expect(result.lines[0]).toMatchObject({ key: 'Видача', action: 'error' });
    expect(result.lines[1].detail).toBe('чорний · рухів: 3');
    expect(result.notes?.length).toBe(2);
  });

  it('maps the stock form choices with the colours of «Кольори»', () => {
    const choices = mapFabricStockChoices({
      fabrics: [{ id: 23, code: 'FAB-023', name: 'Грета' }],
      suppliers: [],
      colors: ['Чорний', 'Темно-синій кол.1076'],
    });
    expect(choices.colors).toEqual(['Чорний', 'Темно-синій кол.1076']);
    expect(() => mapFabricStockChoices({ fabrics: [], suppliers: [] })).toThrow();
  });
});

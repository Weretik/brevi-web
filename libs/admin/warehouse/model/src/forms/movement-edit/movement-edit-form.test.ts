import { describe, expect, it } from 'vitest';

import {
  createMovementEditValues,
  movementEditBody,
  movementEditEffect,
  validateMovementEdit,
} from './movement-edit-form';

import type { FabricMovementRow } from '../../entities/movements/fabric-movement';
import type { FabricStockPair } from '../../entities/stock/fabric-stock';

const row = (patch: Partial<FabricMovementRow> = {}): FabricMovementRow => ({
  id: 7,
  stockId: 1,
  kind: 'Receipt',
  operationDate: '2026-11-10',
  createdAt: '2026-11-10T08:00:00Z',
  fabricCode: 'FAB-023',
  groupCode: 'FAB-023',
  fabricName: 'Грета',
  color: 'Синій',
  supplierName: 'Тексика',
  document: 'Н-15',
  orderId: null,
  itemId: null,
  orderNumber: null,
  modelName: null,
  destination: null,
  delta: 10,
  metersAfter: 10,
  pairMetersAfter: null,
  perProduct: null,
  note: null,
  createdByName: 'Олена',
  isReversed: false,
  reversesMovementId: null,
  canReverse: true,
  isVoided: false,
  revision: 2,
  canEdit: true,
  ...patch,
});

const pair = (code: string, color: string): FabricStockPair => ({
  fabric: {
    fabricCode: code,
    codes: [code],
    fabricName: 'Оксфорд',
    composition: null,
    density: null,
    supplier: null,
    meters: 4,
    booked: 0,
    free: 4,
    colors: [],
  },
  color: {
    color,
    colorKey: color.toLowerCase(),
    meters: 4,
    version: 'v1',
    sources: [],
    booked: 0,
    free: 4,
    toOrder: 0,
    lastMovement: null,
    bookings: [],
  },
});

describe('movement edit form', () => {
  it('starts from the row and refuses an edit that changes nothing', () => {
    const values = createMovementEditValues(row());
    expect(values).toMatchObject({ meters: '10', supplierName: 'Тексика', fabricId: null });
    expect(validateMovementEdit(row(), values).meters).toBe('Нічого не змінено.');
    expect(validateMovementEdit(row(), { ...values, meters: '8' })).toEqual({});
  });

  it('A28: a receipt 10 → 8 changes the line by −2 and keeps the revision guard', () => {
    const values = { ...createMovementEditValues(row()), meters: '8' };
    expect(movementEditEffect(row(), values)).toEqual({ moves: false, change: -2 });
    expect(movementEditBody(row(), values, null, 'op')).toMatchObject({
      expectedRevision: 2,
      meters: 8,
      fabricId: null,
      fabricCode: null,
      color: null,
    });
  });

  it('checks the sign by kind; a correction keeps its own sign', () => {
    const issue = row({ kind: 'Issue', delta: -5, supplierName: null, document: null });
    const adjustment = row({ kind: 'Adjustment', delta: -2.75 });
    expect(createMovementEditValues(issue).meters).toBe('5');
    expect(createMovementEditValues(adjustment).meters).toBe('-2,75');
    expect(
      validateMovementEdit(issue, { ...createMovementEditValues(issue), meters: '-1' }).meters,
    ).toMatch(/більше нуля/);
    expect(
      validateMovementEdit(adjustment, { ...createMovementEditValues(adjustment), meters: '0' })
        .meters,
    ).toMatch(/не нуль/);
  });

  it('A30: an issue moved to another pair gives the old pair its metres back', () => {
    const issue = row({ kind: 'Issue', delta: -5, supplierName: null, document: null });
    const values = {
      ...createMovementEditValues(issue),
      pairCode: 'FAB-005',
      pairColorKey: 'жовтий',
    };
    expect(movementEditEffect(issue, values)).toEqual({ moves: true, back: 5, change: -5 });
    expect(movementEditBody(issue, values, pair('FAB-005', 'Жовтий'), 'op')).toMatchObject({
      fabricCode: 'FAB-005',
      color: 'Жовтий',
      meters: 5,
    });
  });

  it('a receipt in another colour sends only the colour', () => {
    const values = { ...createMovementEditValues(row()), color: 'Червоний' };
    expect(movementEditBody(row(), values, null, 'op')).toMatchObject({
      fabricId: null,
      color: 'Червоний',
    });
    expect(movementEditBody(row(), { ...values, color: ' синій ' }, null, 'op').color).toBeNull();
  });
});

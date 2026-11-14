import { describe, expect, it } from 'vitest';

import {
  adjustmentDelta,
  balanceAfterIssue,
  createFabricAdjustmentValues,
  createFabricIssueValues,
  createFabricOpeningValues,
  createFabricReceiptValues,
  fabricAdjustmentBody,
  fabricIssueBody,
  fabricReceiptBody,
  nextFabricReceiptValues,
  presetFabricReceiptValues,
  validateFabricAdjustment,
  validateFabricIssue,
  validateFabricOpening,
  validateFabricReceipt,
} from './stock-operation-forms';

import type { FabricStockPair } from '../../entities/stock/fabric-stock';

const pair = (meters: number): FabricStockPair => ({
  fabric: {
    fabricCode: 'FAB-023',
    codes: ['FAB-023', 'FAB-067'],
    fabricName: 'Грета',
    composition: null,
    density: null,
    supplier: null,
    meters,
    booked: 0,
    free: meters,
    colors: [],
  },
  color: {
    color: 'Синій',
    colorKey: 'синій',
    meters,
    version: 'abc',
    sources: [],
    booked: 0,
    free: meters,
    toOrder: 0,
    lastMovement: null,
    bookings: [],
  },
});

describe('stock operation forms', () => {
  it('lets an opening be zero but not below', () => {
    const values = { ...createFabricOpeningValues('2026-11-11'), fabricId: 1, color: 'Синій' };
    expect(validateFabricOpening({ ...values, meters: '0' })).toEqual({});
    expect(validateFabricOpening({ ...values, meters: '-1' }).meters).toBeTruthy();
  });

  it('checks a receipt and sends empty texts as null', () => {
    const empty = createFabricReceiptValues('2026-11-11');
    expect(Object.keys(validateFabricReceipt(empty))).toEqual(['fabricId', 'color', 'meters']);
    const values = { ...empty, fabricId: 5, color: ' Синій ', meters: '12,5' };
    expect(validateFabricReceipt(values)).toEqual({});
    expect(fabricReceiptBody(values, 'op')).toEqual({
      operationId: 'op',
      fabricId: 5,
      color: 'Синій',
      meters: 12.5,
      operationDate: '2026-11-11',
      supplierName: null,
      document: null,
      note: null,
    });
    expect(validateFabricReceipt({ ...values, meters: '1,234' }).meters).toBeTruthy();
    expect(validateFabricReceipt({ ...values, document: 'x'.repeat(161) }).document).toBeTruthy();
  });

  it('keeps the fabric and colour for the next receipt, clearing metres and document', () => {
    const values = {
      ...createFabricReceiptValues('2026-11-11'),
      fabricId: 5,
      meters: '3',
      document: 'Н-1',
    };
    expect(nextFabricReceiptValues(values)).toMatchObject({
      fabricId: 5,
      meters: '',
      document: '',
    });
  });

  it('lets a one-off issue go below zero and shows the balance after it', () => {
    const values = {
      ...createFabricIssueValues('2026-11-11'),
      fabricCode: 'FAB-023',
      colorKey: 'синій',
      meters: '5',
    };
    expect(validateFabricIssue(values, pair(2))).toEqual({});
    expect(balanceAfterIssue(values, pair(2))).toBe(-3);
    expect(fabricIssueBody(values, pair(2), 'op')).toMatchObject({
      fabricCode: 'FAB-023',
      color: 'Синій',
      expectedVersion: 'abc',
      meters: 5,
      destination: null,
    });
    expect(validateFabricIssue({ ...values, colorKey: 'червоний' }, null).colorKey).toBeTruthy();
  });

  it('adjusts to a counted total that does not create or deepen a shortage', () => {
    const values = (target: string) => ({
      ...createFabricAdjustmentValues('2026-11-11', 15),
      targetMeters: target,
      reason: 'Перерахунок',
    });
    expect(validateFabricAdjustment(values('12,25'), 15)).toEqual({});
    expect(adjustmentDelta(values('12,25'), 15)).toBe(-2.75);
    expect(validateFabricAdjustment(values('-1'), 15).targetMeters).toBeTruthy();
    expect(validateFabricAdjustment(values('-5'), -10)).toEqual({});
    expect(validateFabricAdjustment(values('-12'), -10).targetMeters).toBeTruthy();
    expect(validateFabricAdjustment(values('15'), 15).targetMeters).toBeTruthy();
    expect(validateFabricAdjustment({ ...values('1'), reason: 'ok' }, 15).reason).toBeTruthy();
    expect(fabricAdjustmentBody(values('12,25'), pair(15), 'op')).toMatchObject({
      targetMeters: 12.25,
      expectedVersion: 'abc',
      reason: 'Перерахунок',
    });
  });
});

describe('presetFabricReceiptValues', () => {
  const choices = {
    fabrics: [
      {
        id: 7,
        code: 'FAB-023',
        groupCode: 'FAB-023',
        name: 'Грета',
        composition: null,
        density: null,
        supplier: 'Тексика',
        price: null,
      },
      {
        id: 9,
        code: 'FAB-067',
        groupCode: 'FAB-023',
        name: 'Грета',
        composition: null,
        density: null,
        supplier: 'Черкаси',
        price: null,
      },
      {
        id: 11,
        code: 'FAB-101',
        groupCode: 'FAB-100',
        name: 'Оксфорд',
        composition: null,
        density: null,
        supplier: null,
        price: null,
      },
    ],
    suppliers: ['Тексика', 'Черкаси'],
    colors: ['Темно-сірий', 'Чорний'],
  };
  const empty = createFabricReceiptValues('2026-11-12');

  it('takes the offer with the code, the colour as the list spells it and the supplier', () => {
    expect(
      presetFabricReceiptValues(empty, choices, {
        fabricCode: 'FAB-067',
        color: 'темно-сірий',
        supplier: null,
      }),
    ).toMatchObject({
      fabricId: 9,
      color: 'Темно-сірий',
      supplierName: 'Черкаси',
      operationDate: '2026-11-12',
    });
  });

  it('falls back to an offer of the group and keeps an unknown colour', () => {
    expect(
      presetFabricReceiptValues(empty, choices, {
        fabricCode: 'FAB-100',
        color: 'Хакі',
        supplier: 'Склад',
      }),
    ).toMatchObject({ fabricId: 11, color: 'Хакі', supplierName: 'Склад' });
    expect(
      presetFabricReceiptValues(empty, choices, {
        fabricCode: 'FAB-999',
        color: 'Чорний',
        supplier: null,
      }),
    ).toMatchObject({ fabricId: null, color: 'Чорний' });
  });
});

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
    meters,
    colors: [],
  },
  color: { color: 'Синій', colorKey: 'синій', meters, version: 'abc', sources: [] },
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

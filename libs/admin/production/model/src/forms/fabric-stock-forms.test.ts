import { describe, expect, it } from 'vitest';

import {
  createFabricIssueValues,
  createFabricReceiptValues,
  fabricIssueBody,
  hasFabricIssueErrors,
  parseStockMeters,
  stockColorKey,
  validateFabricCorrection,
  validateFabricIssue,
  validateFabricReceipt,
} from './fabric-stock-forms';
import { fabricStockCsv } from '../queries/fabric-stock-csv';
import { countFabricStock, fabricStockProblem } from '../queries/fabric-stock-filters';
import { parseFabricStockImportFile } from '../validators/fabric-stock-import-file';

import type { FabricStockRow, ProductionItemFabric } from '../entities/fabric-stock';

const row = (patch: Partial<FabricStockRow>): FabricStockRow => ({
  id: 1,
  fabricId: 4,
  fabricCode: 'FAB-1',
  fabricName: 'Оксфорд',
  color: 'Чорний',
  meters: 10,
  reserved: 0,
  available: 10,
  price: 100,
  value: 1000,
  version: 1,
  updatedAt: null,
  ...patch,
});

const fabric: ProductionItemFabric = {
  orderId: 5,
  itemId: 3,
  orderVersion: 2,
  fabricCode: 'FAB-1',
  fabricName: 'Оксфорд',
  quantity: 10,
  hasNorm: true,
  plan: [
    {
      fabricCode: 'FAB-1',
      color: 'Чорний',
      colorKey: 'чорний',
      planned: 15,
      covered: 5,
      issued: 5,
      reserved: 10.5,
      stockId: 1,
      stockMeters: 20,
      stockAvailable: 9.5,
    },
    {
      fabricCode: 'FAB-1',
      color: 'Синій',
      colorKey: 'синій',
      planned: 2,
      covered: 2,
      issued: 2,
      reserved: 0,
      stockId: 2,
      stockMeters: 1,
      stockAvailable: 1,
    },
  ],
  issued: 7,
  issues: [],
  canIssue: true,
};

describe('fabric stock forms', () => {
  it('reads metres with a comma and two decimals at most', () => {
    expect(parseStockMeters('12,5')).toBe(12.5);
    expect(parseStockMeters('1.255')).toBeNull();
    expect(parseStockMeters('abc')).toBeNull();
    expect(stockColorKey('  Темно   Синій ')).toBe('темно синій');
  });

  it('needs a fabric, a colour and positive metres for a receipt', () => {
    const values = createFabricReceiptValues('2026-11-04', null);
    expect(Object.keys(validateFabricReceipt(values)).sort()).toEqual([
      'color',
      'fabricId',
      'meters',
    ]);
    expect(
      validateFabricReceipt({ ...values, fabricId: 4, color: 'чорний', meters: '3,5' }),
    ).toEqual({});
  });

  it('needs a reason and a different count for a correction', () => {
    const errors = validateFabricCorrection(
      { countedMeters: '10', operationDate: '2026-11-04', note: '' },
      10,
    );
    expect(errors.countedMeters).toBeDefined();
    expect(errors.note).toBe('Вкажіть причину.');
  });

  it('starts an issue with what is still reserved and keeps planned lines on the plan', () => {
    const values = createFabricIssueValues(fabric, 4, '2026-11-04');
    expect(values.lines).toHaveLength(1);
    expect(values.lines[0]).toMatchObject({ purpose: 'Planned', color: 'Чорний', meters: '10,5' });
    const code = (id: number | null) => (id === 4 ? 'FAB-1' : 'FAB-2');
    expect(hasFabricIssueErrors(validateFabricIssue(values, fabric, code))).toBe(false);
    const wrong = { ...values, lines: [{ ...values.lines[0], fabricId: 9 }] };
    expect(validateFabricIssue(wrong, fabric, code).line[values.lines[0].key]?.color).toMatch(
      /Заміна/,
    );
    const extra = { ...values, lines: [{ ...values.lines[0], purpose: 'Additional' as const }] };
    expect(fabricIssueBody(extra, 2).lines[0]).toMatchObject({ planColorKey: null, meters: 10.5 });
  });
});

describe('fabric stock list', () => {
  it('marks only lines with a problem', () => {
    expect(fabricStockProblem(row({}))).toBeNull();
    expect(fabricStockProblem(row({ meters: -2, available: -2 }))).toMatch(/Мінус/);
    expect(fabricStockProblem(row({ reserved: 15, available: -5 }))).toBe('Не вистачає 5 м');
    expect(countFabricStock([row({}), row({ meters: -1, available: -1 })])).toEqual({
      short: 1,
      negative: 1,
      reserved: 0,
    });
  });

  it('exports the value only for people who see it', () => {
    expect(fabricStockCsv([row({ meters: 2.5 })], false)).toContain(
      'FAB-1;Оксфорд;Чорний;2,5;0;10',
    );
    expect(fabricStockCsv([row({})], false)).not.toContain('Вартість');
    expect(fabricStockCsv([row({})], true)).toContain('Вартість, грн');
  });

  it('accepts the transfer file only with all its parts', () => {
    expect(parseFabricStockImportFile('{"stocks":[]}').error).toMatch(/oldReservations/);
    const file = parseFabricStockImportFile('{"stocks":[{}],"issues":[],"oldReservations":[]}');
    expect(file.error).toBeNull();
    expect(file.rows).toHaveLength(1);
  });
});

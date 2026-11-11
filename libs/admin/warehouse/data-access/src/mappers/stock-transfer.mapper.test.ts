import { describe, expect, it } from 'vitest';

import { mapStockTransferResult } from './stock-transfer.mapper';

const source = {
  lines: 191,
  pairs: 180,
  movements: 412,
  openings: 150,
  receipts: 40,
  issues: 200,
  adjustments: 20,
  voided: 2,
  revisions: 5,
  packages: 57,
  issueLines: 187,
  reservations: 60,
  meters: 6969.57,
  negativePairs: 3,
  zeroPairs: 10,
};
const current = {
  lines: 2,
  movements: 3,
  issues: 0,
  plans: 0,
  ownLines: 1,
  ownMovements: 1,
  ownIssues: 0,
};

describe('mapStockTransferResult', () => {
  it('maps a check with what Brevi gets and the notes', () => {
    const result = mapStockTransferResult({
      applied: false,
      unchanged: false,
      hash: 'a'.repeat(64),
      source,
      target: {
        lines: 191,
        movements: 412,
        revisions: 5,
        issues: 57,
        issueLines: 187,
        plans: 56,
        meters: 6969.57,
      },
      current,
      needsConfirmation: true,
      errors: [],
      notes: [{ table: 'fabric_stock', rowId: null, message: 'FAB-999 немає в «Тканинах».' }],
      lastTransferAt: null,
    });
    expect(result.target?.plans).toBe(56);
    expect(result.current.ownLines).toBe(1);
    expect(result.notes[0]).toEqual({
      table: 'fabric_stock',
      rowId: null,
      message: 'FAB-999 немає в «Тканинах».',
    });
  });

  it('keeps a refused export without a target and rejects a broken answer', () => {
    const refused = mapStockTransferResult({
      applied: false,
      unchanged: false,
      hash: 'b'.repeat(64),
      source,
      target: null,
      current,
      needsConfirmation: false,
      errors: [{ table: 'production_orders', rowId: 'o-1', message: 'Завдання №5 немає в Brevi.' }],
      notes: [],
      lastTransferAt: '2026-11-11T08:00:00Z',
    });
    expect(refused.target).toBeNull();
    expect(refused.errors).toHaveLength(1);
    expect(() => mapStockTransferResult({ ...refused, source: { lines: 1 } })).toThrow();
  });
});

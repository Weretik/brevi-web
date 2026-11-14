import { describe, expect, it } from 'vitest';

import { mapBankStatementDetails } from './accounting-statement.mapper';

const statement = {
  id: 's1',
  accountId: 'a1',
  accountName: 'Банк',
  fileName: 'Виписка.xlsx',
  status: 'Preview',
  lineCount: 1,
  firstDate: '2026-10-01',
  lastDate: '2026-10-31',
  transactionCount: 0,
  transferCount: 0,
  createdBy: 'director@brevi.com.ua',
  createdAt: '2026-11-08T08:00:00+00:00',
  bookedBy: null,
  bookedAt: null,
  version: 1,
  existing: false,
};

const errorLine = {
  id: 'l1',
  rowNumber: 5,
  date: null,
  time: null,
  type: null,
  amountMinor: null,
  currency: null,
  bankName: '',
  edrpou: '',
  iban: '',
  purpose: '',
  document: '',
  bankId: null,
  error: 'Не вдалося прочитати суму «abc».',
  duplicate: 'None',
  duplicateNote: '',
  transferAccountId: null,
  transferAccountName: null,
  counterparty: null,
  categoryId: null,
  categoryRootId: null,
  categoryRootName: null,
  subcategoryName: null,
  oneoffName: '',
  description: '',
  comment: '',
  excluded: false,
  state: 'Error',
  willBook: false,
  transactionId: null,
  transferId: null,
};

const details = {
  statement,
  states: [{ state: 'Error', count: 1 }],
  totals: { operations: 0, incomeMinor: 0, expenseMinor: 0, transfers: 0 },
  lines: [errorLine],
  total: 1,
  page: 1,
  pageSize: 100,
};

describe('mapBankStatementDetails', () => {
  it('maps a statement with a line the bank file could not give', () => {
    const mapped = mapBankStatementDetails(details);

    expect(mapped.statement.status).toBe('Preview');
    expect(mapped.lines[0]).toMatchObject({ date: null, type: null, state: 'Error' });
    expect(mapped.states).toEqual([{ state: 'Error', count: 1 }]);
  });

  it('rejects an unknown line state', () => {
    expect(() =>
      mapBankStatementDetails({ ...details, lines: [{ ...errorLine, state: 'Odd' }] }),
    ).toThrow('стан рядка');
  });
});

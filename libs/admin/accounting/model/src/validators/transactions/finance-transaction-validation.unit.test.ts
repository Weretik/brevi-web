import { describe, expect, it } from 'vitest';

import { validateFinanceTransaction } from './finance-transaction-validation';
import { validateFinanceTransfer } from '../transfers/finance-transfer-validation';

const operation = {
  date: '2026-10-15',
  type: 'Expense' as const,
  accountId: 'a1',
  rootId: 'c1',
  subcategoryId: '',
  amount: '300',
  oneoffName: '',
  description: '',
  comment: '',
};

describe('operation and transfer forms', () => {
  it('keeps each area on its side of 01.10.2026', () => {
    expect(validateFinanceTransaction(operation, 'Current', '2026-10-01', null)).toEqual({});
    expect(
      validateFinanceTransaction(
        { ...operation, date: '2026-09-30' },
        'Current',
        '2026-10-01',
        null,
      ).date,
    ).toMatch(/з 01\.10\.2026/);
    expect(validateFinanceTransaction(operation, 'LegacyArchive', '2026-10-01', null).date).toMatch(
      /до 30\.09\.2026/,
    );
    expect(
      validateFinanceTransaction(operation, 'LegacyArchive', '2026-10-01', '2026-10-15').date,
    ).toBeUndefined();
  });

  it('needs an account, a category and a positive amount', () => {
    expect(
      validateFinanceTransaction(
        { ...operation, accountId: '', rootId: '', amount: '0' },
        'Current',
        '2026-10-01',
        null,
      ),
    ).toEqual({
      accountId: 'Оберіть рахунок.',
      rootId: 'Оберіть категорію.',
      amount: 'Сума має бути більшою за нуль.',
    });
  });

  it('refuses a transfer to the same account or another currency', () => {
    const transfer = {
      date: '2026-10-15',
      fromAccountId: 'a1',
      toAccountId: 'a1',
      amount: '5',
      note: '',
    };
    const currency = (id: string) => (id === 'eur' ? 'EUR' : 'UAH');
    expect(
      validateFinanceTransfer(transfer, 'Current', '2026-10-01', null, currency).toAccountId,
    ).toMatch(/різними/);
    expect(
      validateFinanceTransfer(
        { ...transfer, toAccountId: 'eur' },
        'Current',
        '2026-10-01',
        null,
        currency,
      ).toAccountId,
    ).toMatch(/валюти/);
  });
});

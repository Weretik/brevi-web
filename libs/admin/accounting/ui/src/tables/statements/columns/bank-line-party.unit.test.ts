import { describe, expect, it } from 'vitest';

import { bankLineParty, bankLineProblems } from './bank-line-party';

import type { BankStatementLine } from '@admin/accounting/model';

const line = (patch: Partial<BankStatementLine>) =>
  ({
    transferAccountName: null,
    counterparty: null,
    oneoffName: null,
    bankName: 'ТОВ Тканини',
    edrpou: '12345678',
    duplicate: 'None',
    state: 'Ready',
    ...patch,
  }) as BankStatementLine;

describe('bankLineParty', () => {
  it('shows a transfer to the own account', () => {
    expect(bankLineParty(line({ transferAccountName: 'Каса' }))).toEqual({
      name: 'Каса',
      caption: 'Переказ',
    });
  });

  it('falls back to the bank name with its ЄДРПОУ', () => {
    expect(bankLineParty(line({}))).toEqual({ name: 'ТОВ Тканини', caption: 'ЄДРПОУ 12345678' });
    expect(bankLineParty(line({ bankName: '', edrpou: undefined }))).toEqual({
      name: '—',
      caption: null,
    });
  });
});

describe('bankLineProblems', () => {
  it('marks nothing on a clean line', () => {
    expect(bankLineProblems(line({}))).toEqual([]);
  });

  it('marks a probable duplicate and a line without a category', () => {
    expect(bankLineProblems(line({ duplicate: 'Probable', state: 'NeedsCategory' }))).toEqual([
      'Схоже на дублікат',
      'Без категорії',
    ]);
  });
});

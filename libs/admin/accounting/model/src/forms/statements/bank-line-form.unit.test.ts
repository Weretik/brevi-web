import { describe, expect, it } from 'vitest';

import { bankLineBody, createBankLineFormValues, validateBankLine } from './bank-line-form';
import { bankStatementFileProblem } from '../../entities/statements/bank-statement';

import type { BankStatementLine } from '../../entities/statements/bank-statement';

const line = {
  transferAccountId: null,
  categoryId: 'c2',
  categoryRootId: 'c1',
  subcategoryName: 'Тканини',
  counterparty: {
    kind: 'Financial',
    id: 'f1',
    name: 'ТОВ Тканини',
    active: true,
    verified: true,
    missing: false,
  },
  oneoffName: '',
  description: ' Тканина ',
  comment: '',
  excluded: false,
} as unknown as BankStatementLine;

describe('bank line form', () => {
  it('sends the subcategory and the picked counterparty', () => {
    expect(bankLineBody(createBankLineFormValues(line), line)).toEqual({
      categoryId: 'c2',
      counterparty: { kind: 'Financial', id: 'f1' },
      oneoffName: null,
      description: 'Тканина',
      comment: null,
      excluded: false,
    });
  });

  it('keeps only the note and «Проводити» of a transfer', () => {
    const transfer = { ...line, transferAccountId: 'a2', comment: 'Зняття' };
    expect(bankLineBody(createBankLineFormValues(transfer), transfer)).toEqual({
      categoryId: null,
      counterparty: null,
      oneoffName: null,
      description: null,
      comment: 'Зняття',
      excluded: false,
    });
  });

  it('needs a name when «Разова назва» is on', () => {
    const values = { ...createBankLineFormValues(line), oneoff: true, oneoffName: ' ' };
    expect(validateBankLine(values)).toEqual({
      oneoffName: 'Вкажіть назву або вимкніть «Разова назва».',
    });
  });

  it('accepts only XLSX, XLS and CSV up to 12 MB', () => {
    expect(bankStatementFileProblem({ name: 'Виписка.XLSX', size: 10 })).toBeNull();
    expect(bankStatementFileProblem({ name: 'a.pdf', size: 10 })).toMatch(/XLSX, XLS або CSV/);
    expect(bankStatementFileProblem({ name: 'a.csv', size: 0 })).toBe('Файл порожній.');
    expect(bankStatementFileProblem({ name: 'a.xls', size: 13 * 1024 * 1024 })).toMatch(/12 МБ/);
  });
});

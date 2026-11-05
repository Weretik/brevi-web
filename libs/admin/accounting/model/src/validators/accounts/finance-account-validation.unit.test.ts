import { describe, expect, it } from 'vitest';

import { validateFinanceAccount, validateFinanceCutover } from './finance-account-validation';

const valid = {
  name: 'ПриватБанк ФОП',
  type: 'Bank' as const,
  currency: 'UAH',
  iban: 'UA21 3052 9900 0002 6007 0000 0000 1',
  opening: '1 000,00',
  openingDate: '2024-01-01',
  note: '',
};

describe('finance account validation', () => {
  it('accepts a filled form', () => {
    expect(validateFinanceAccount(valid)).toEqual({});
  });

  it('explains each wrong field', () => {
    expect(
      validateFinanceAccount({
        ...valid,
        name: ' ',
        currency: 'грн',
        opening: '1,234',
        openingDate: '1999-12-31',
      }),
    ).toEqual({
      name: 'Вкажіть назву рахунку.',
      currency: 'Три латинські літери, наприклад UAH.',
      opening: 'Вкажіть суму, наприклад 62 546,40.',
      openingDate: 'Вкажіть дату між 2000 і 2100 роком.',
    });
  });

  it('needs an amount for the balance on 01.10', () => {
    expect(validateFinanceCutover({ balance: '' })).not.toBeNull();
    expect(validateFinanceCutover({ balance: '62 546,40' })).toBeNull();
  });
});

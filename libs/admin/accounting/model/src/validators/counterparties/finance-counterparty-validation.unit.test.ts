import { describe, expect, it } from 'vitest';

import { validateFinanceCounterparty } from './finance-counterparty-validation';
import { financeCounterpartyBody } from '../../forms/counterparties/finance-counterparty-form';

const values = {
  name: 'ФОП Іваненко',
  edrpou: '12 345 678',
  iban: '',
  bankName: '',
  aliases: 'Іваненко\n\nIVANENKO;  ',
  rootId: '',
  subcategoryId: '',
  autoApplyCategory: false,
  note: '',
};

describe('finance counterparty form', () => {
  it('needs a name and a digits-only ЄДРПОУ', () => {
    expect(validateFinanceCounterparty(values, true)).toEqual({});
    expect(validateFinanceCounterparty({ ...values, name: ' ', edrpou: '12A' }, true)).toEqual({
      name: 'Вкажіть назву контрагента.',
      edrpou: 'Лише цифри, не більше 32.',
    });
  });

  it('applies a category automatically only for a verified counterparty with one', () => {
    const auto = { ...values, autoApplyCategory: true };
    expect(validateFinanceCounterparty(auto, true).autoApplyCategory).toBeDefined();
    expect(
      validateFinanceCounterparty({ ...auto, rootId: 'c1' }, false).autoApplyCategory,
    ).toBeDefined();
    expect(validateFinanceCounterparty({ ...auto, rootId: 'c1' }, true)).toEqual({});
  });

  it('sends aliases one per line and the subcategory over the root', () => {
    expect(financeCounterpartyBody({ ...values, rootId: 'c1', subcategoryId: 'c2' })).toMatchObject(
      {
        edrpou: '12345678',
        aliases: ['Іваненко', 'IVANENKO'],
        defaultCategoryId: 'c2',
        iban: null,
      },
    );
  });
});

import { describe, expect, it } from 'vitest';

import { ppeCreateBody, ppeCreateFormDefaults, ppeCreateServerErrors } from './ppe-create-form';

import type { PpeCreateFormValues } from './ppe-create-form';

const values: PpeCreateFormValues = {
  ...ppeCreateFormDefaults,
  name: ' Рукавиці нітрилові ',
  code: ' 1017 ',
  sectionId: 9,
  unit: 'пара ',
  supplierId: 5,
  supplierSku: '  ',
  supplierUrl: 'https://avcentr.com.ua/ua/rukavytsi ',
  supplierPrice: '42,50',
  ruleCode: 'Рукавиці — АВ-Центр',
};

describe('ppeCreateBody', () => {
  it('builds a trimmed PPE create body with the supplier block', () => {
    expect(ppeCreateBody(values)).toEqual({
      type: 'Ppe',
      code: '1017',
      name: 'Рукавиці нітрилові',
      sectionId: 9,
      season: null,
      isActive: true,
      currentSiteUrl: null,
      quoteDescription: null,
      ppe: {
        supplierId: 5,
        supplierSku: null,
        supplierUrl: 'https://avcentr.com.ua/ua/rukavytsi',
        supplierPrice: 42.5,
        allowManualPrice: false,
        ruleCode: 'Рукавиці — АВ-Центр',
        unit: 'пара',
      },
    });
  });
});

describe('ppeCreateServerErrors', () => {
  it('maps server identifiers to form fields and drops unknown ones', () => {
    expect(
      ppeCreateServerErrors({
        code: 'Код зайнятий.',
        sectionId: 'Розділ не ЗІЗ.',
        'ppe.SupplierId': 'Постачальника немає.',
        'ppe.RuleCode': 'Правила немає.',
        type: 'Невідомий тип.',
      }),
    ).toEqual({
      code: 'Код зайнятий.',
      sectionId: 'Розділ не ЗІЗ.',
      supplierId: 'Постачальника немає.',
      ruleCode: 'Правила немає.',
    });
  });
});

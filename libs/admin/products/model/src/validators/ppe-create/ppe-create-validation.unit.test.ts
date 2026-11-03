import { describe, expect, it } from 'vitest';

import { ppeCodeTakenMessage, validatePpeCreate } from './ppe-create-validation';
import { ppeCreateFormDefaults } from '../../forms/ppe-create/ppe-create-form';

import type { PpeCreateFormValues } from '../../forms/ppe-create/ppe-create-form';

const valid: PpeCreateFormValues = {
  ...ppeCreateFormDefaults,
  name: 'Рукавиці нітрилові',
  code: '1017',
  sectionId: 9,
  unit: 'пара',
  supplierId: 5,
  supplierUrl: 'https://avcentr.com.ua/ua/rukavytsi',
  supplierPrice: '42,50',
  ruleCode: 'Рукавиці — АВ-Центр',
};

describe('validatePpeCreate', () => {
  it('accepts a complete form', () => {
    expect(validatePpeCreate(valid)).toEqual({});
  });

  it('asks for every required field of an empty form', () => {
    expect(Object.keys(validatePpeCreate(ppeCreateFormDefaults)).sort()).toEqual(
      [
        'code',
        'name',
        'ruleCode',
        'sectionId',
        'supplierId',
        'supplierPrice',
        'supplierUrl',
        'unit',
      ].sort(),
    );
  });

  it('rejects http links, a zero price and a too large price', () => {
    expect(
      validatePpeCreate({
        ...valid,
        supplierUrl: 'http://avcentr.com.ua',
        currentSiteUrl: 'brevi.com.ua',
        supplierPrice: '0',
      }),
    ).toEqual({
      supplierUrl: 'Посилання має починатися з https://.',
      currentSiteUrl: 'Посилання має починатися з https://.',
      supplierPrice: 'Ціна більше 0, до 2 знаків після коми.',
    });
    expect(validatePpeCreate({ ...valid, supplierPrice: '10000000' }).supplierPrice).toBe(
      'Ціна має бути менше 10 000 000 ₴.',
    );
  });

  it('names the product that holds a taken code', () => {
    expect(ppeCodeTakenMessage('Рукавиці')).toBe('Такий артикул уже є: «Рукавиці». Вкажіть інший.');
  });
});

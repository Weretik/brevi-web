import { describe, expect, it } from 'vitest';

import { createPpeMarkupRuleFormValues, ppeMarkupRuleBody } from './ppe-markup-rule-form';
import { createPricingParameterFormValues, pricingParameterBody } from './pricing-parameter-form';
import {
  formatParameterValue,
  parameterSection,
} from '../../mappers/pricing-parameters/pricing-parameter-format';
import {
  filterPricingParameters,
  listPricingParameterSections,
} from '../../queries/pricing-parameters/pricing-parameter-filters';
import { validatePricingParameter } from '../../validators/pricing-parameters/pricing-parameter-validation';

import type { PricingParameter } from '../../entities/pricing-parameters/pricing-parameter';

const parameter = (overrides: Partial<PricingParameter> = {}): PricingParameter => ({
  id: 1,
  code: 'CUTTING_RATE',
  group: 'Виробництво',
  name: 'Коефіцієнт крою',
  value: 0.2174,
  unit: '%',
  isCalculated: false,
  updatedOn: '2026-08-30',
  comment: null,
  sortOrder: 8,
  ...overrides,
});

describe('pricing parameters', () => {
  it('shows values in the sheet units', () => {
    expect(formatParameterValue(0.2174, '%')).toBe('21,74 %');
    expect(formatParameterValue(17500, 'грн/міс.').replace(/\s/g, ' ')).toBe('17 500 грн/міс.');
    expect(formatParameterValue(1.55, 'коеф.')).toBe('1,55 коеф.');
    expect(formatParameterValue(1.7784552845, 'грн/хв')).toBe('1,7785 грн/хв');
    expect(formatParameterValue(null, 'грн/хв')).toBe('—');
  });

  it('edits a percent as 21.74 and sends it back as a fraction', () => {
    const values = createPricingParameterFormValues(parameter());
    expect(values.value).toBe('21.74');
    expect(pricingParameterBody({ ...values, value: '25,5' }, 8)).toMatchObject({
      value: 0.255,
      unit: '%',
      sortOrder: 8,
    });
  });

  it('sends no value for a calculated parameter and needs none', () => {
    const values = createPricingParameterFormValues(
      parameter({
        code: 'MINUTE_COST_SEAMSTRESS',
        value: 1.78,
        unit: 'грн/хв',
        isCalculated: true,
      }),
    );
    expect(validatePricingParameter({ ...values, value: '' })).toEqual({});
    expect(pricingParameterBody(values, 6).value).toBeNull();
  });

  it('rejects a code with spaces and a negative value', () => {
    const errors = validatePricingParameter({
      ...createPricingParameterFormValues(null),
      code: 'bad code',
      group: 'Г',
      name: 'Н',
      unit: '%',
      value: '-1',
    });
    expect(Object.keys(errors).sort()).toEqual(['code', 'value']);
  });

  it('groups PPE subgroups into one section and filters by it', () => {
    const rows = [
      parameter(),
      parameter({ id: 2, code: 'PPE_GLOVES_1', group: 'Прибуток — ЗІЗ: Рукавички' }),
      parameter({ id: 3, code: 'PPE_PRICE_COEF_1', group: 'Прибуток — ЗІЗ' }),
    ];
    expect(parameterSection('Прибуток — ЗІЗ: Рукавички')).toBe('Прибуток — ЗІЗ');
    expect(listPricingParameterSections(rows)).toEqual([
      { value: 'Виробництво', count: 1 },
      { value: 'Прибуток — ЗІЗ', count: 2 },
    ]);
    expect(filterPricingParameters(rows, 'gloves', null).map((row) => row.id)).toEqual([2]);
    expect(filterPricingParameters(rows, '', 'Прибуток — ЗІЗ').map((row) => row.id)).toEqual([
      2, 3,
    ]);
  });

  it('edits PPE markups as percents and sends fractions', () => {
    const values = createPpeMarkupRuleFormValues({
      id: 1,
      name: 'Взуття',
      retailMarkup: 0.45,
      wholesaleMarkup: 0.37,
      largeWholesaleMarkup: 0.3,
      priceNote: null,
      appliesTo: 'Усе робоче взуття',
      sortOrder: 2,
    });
    expect(values.retailMarkup).toBe('45');
    expect(ppeMarkupRuleBody({ ...values, wholesaleMarkup: '36' }, 2)).toEqual({
      retailMarkup: 0.45,
      wholesaleMarkup: 0.36,
      largeWholesaleMarkup: 0.3,
      priceNote: null,
      appliesTo: 'Усе робоче взуття',
      sortOrder: 2,
    });
  });
});

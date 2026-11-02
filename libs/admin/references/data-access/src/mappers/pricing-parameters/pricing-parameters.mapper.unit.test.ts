import { describe, expect, it } from 'vitest';

import { mapPpeMarkupRules, mapPricingParameters } from './pricing-parameters.mapper';
import {
  parsePpeMarkupRulesResponse,
  parsePricingParametersResponse,
} from '../../validators/pricing-parameters/pricing-parameters-response';

const parameter = {
  id: 5,
  code: 'MINUTE_COST_SEAMSTRESS',
  group: 'Оплата праці',
  name: 'Вартість 1 хвилини роботи швачки',
  value: 1.7784,
  unit: 'грн/хв',
  isCalculated: true,
  updatedOn: '2026-08-30',
  comment: 'Розраховується без премії',
  sortOrder: 6,
};

const rule = {
  id: 1,
  name: 'Рукавички',
  retailMarkup: 0.36,
  wholesaleMarkup: 0.36,
  largeWholesaleMarkup: 0.31,
  priceNote: 'Оптова ціна діє від 10 од.',
  appliesTo: null,
  sortOrder: 3,
};

describe('pricing parameter responses', () => {
  it('maps valid parameters and PPE rules', () => {
    expect(mapPricingParameters(parsePricingParametersResponse([parameter]))).toEqual([parameter]);
    expect(mapPpeMarkupRules(parsePpeMarkupRulesResponse([rule]))).toEqual([rule]);
  });

  it('accepts a calculated parameter without a value', () => {
    expect(parsePricingParametersResponse([{ ...parameter, value: null }])).toHaveLength(1);
  });

  it('rejects damaged rows before they reach the grid', () => {
    expect(() => parsePricingParametersResponse([{ ...parameter, value: '1,78' }])).toThrow(
      'Некоректний запис параметра.',
    );
    expect(() => parsePpeMarkupRulesResponse([{ ...rule, retailMarkup: null }])).toThrow(
      'Некоректний запис націнки ЗІЗ.',
    );
    expect(() => parsePpeMarkupRulesResponse({})).toThrow(
      'Некоректна відповідь списку націнок ЗІЗ.',
    );
  });
});

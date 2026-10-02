import { describe, expect, it } from 'vitest';

import {
  ADDITIONAL_REFERENCE_UNITS,
  isAdditionalReferenceUnit,
  validateAdditionalReference,
} from './additional-reference-validation';

const validDraft = {
  id: 1,
  name: 'Знижка',
  key: 'discount',
  value: '5',
  unit: '%',
  description: null,
};

describe('additional reference form rules', () => {
  it('uses the same allowed units for the form and validation', () => {
    for (const unit of ADDITIONAL_REFERENCE_UNITS) {
      expect(isAdditionalReferenceUnit(unit)).toBe(true);
      expect(validateAdditionalReference({ ...validDraft, unit }).unit).toBeUndefined();
    }
    expect(isAdditionalReferenceUnit('кг')).toBe(false);
    expect(validateAdditionalReference({ ...validDraft, unit: 'кг' }).unit).toBeDefined();
  });
});

import { describe, expect, it } from 'vitest';

import { canCreatePpe, ppeCreateReadiness } from './ppe-create-readiness';
import { ppeCreateFormDefaults } from '../../forms/ppe-create/ppe-create-form';
import { validatePpeCreate } from '../../validators/ppe-create/ppe-create-validation';

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

const done = (values: PpeCreateFormValues, state: Parameters<typeof ppeCreateReadiness>[2]) =>
  ppeCreateReadiness(values, validatePpeCreate(values), state).map((item) => item.done);

describe('ppeCreateReadiness', () => {
  it('ticks nothing for an empty form', () => {
    expect(done(ppeCreateFormDefaults, 'idle')).toEqual([false, false, false, false, false, false]);
  });

  it('ticks the six required steps', () => {
    expect(done(valid, 'available')).toEqual([true, true, true, true, true, true]);
  });

  it('does not tick the code step while the code is taken or not checked', () => {
    expect(done(valid, 'taken')[0]).toBe(false);
    expect(done(valid, 'checking')[0]).toBe(false);
  });
});

describe('canCreatePpe', () => {
  it('needs a valid form and a code that is not taken', () => {
    const errors = validatePpeCreate(valid);
    expect(canCreatePpe(errors, 'available')).toBe(true);
    expect(canCreatePpe(errors, 'unknown')).toBe(true);
    expect(canCreatePpe(errors, 'taken')).toBe(false);
    expect(canCreatePpe(errors, 'checking')).toBe(false);
    expect(canCreatePpe(validatePpeCreate(ppeCreateFormDefaults), 'available')).toBe(false);
  });
});

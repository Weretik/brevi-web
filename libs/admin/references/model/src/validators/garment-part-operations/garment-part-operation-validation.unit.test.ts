import { describe, expect, it } from 'vitest';

import { validateGarmentPartOperation } from './garment-part-operation-validation';

import type { GarmentPartOperationFormValues } from './garment-part-operation-validation';

const valid: GarmentPartOperationFormValues = {
  id: '1',
  code: 'OP-001',
  garmentPartName: 'Рукав',
  element: 'Рукав',
  variant: 'Прямий',
  name: 'Рукав куртки: прямий',
  min: '6',
  minutesPerProduct: false,
  normCheckedAt: '2026-08-30',
  isActive: true,
  notes: '',
};

describe('garment part operation validation', () => {
  it('accepts a sheet row and fractional minutes', () => {
    expect(validateGarmentPartOperation(valid)).toEqual({});
    expect(validateGarmentPartOperation({ ...valid, min: '1.5' })).toEqual({});
  });

  it('rejects an invalid ID, missing group, long name and no norm', () => {
    expect(
      validateGarmentPartOperation({
        ...valid,
        id: '0',
        garmentPartName: '',
        name: 'Ш'.repeat(256),
        min: '0',
      }),
    ).toEqual({
      id: 'Вкажіть додатний цілий ID.',
      garmentPartName: 'Оберіть групу деталей.',
      name: 'Не більше 255 символів.',
      min: 'Вкажіть норму від 0 до 10000 хв.',
    });
  });

  it('needs no norm when the time is entered per product', () => {
    expect(validateGarmentPartOperation({ ...valid, min: '', minutesPerProduct: true })).toEqual(
      {},
    );
  });
});

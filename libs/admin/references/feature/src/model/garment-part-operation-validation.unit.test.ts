import { describe, expect, it } from 'vitest';

import { validateGarmentPartOperation } from './garment-part-operation-validation';

describe('garment part operation validation', () => {
  it('rejects invalid ID, missing element, long name, and negative minutes', () => {
    expect(
      validateGarmentPartOperation({
        id: 0,
        garmentPartName: '',
        name: 'Ш'.repeat(256),
        min: '-1',
      }),
    ).toEqual({
      id: 'ID має бути додатним цілим числом.',
      garmentPartName: 'Оберіть елемент виробу.',
      name: 'Назва не може перевищувати 255 символів.',
      min: 'Вкажіть невід’ємну кількість хвилин.',
    });
  });

  it('accepts zero and fractional minutes', () => {
    expect(
      validateGarmentPartOperation({ id: 1, garmentPartName: 'Рукав', name: 'Шов', min: '0' }),
    ).toEqual({});
    expect(
      validateGarmentPartOperation({ id: 1, garmentPartName: 'Рукав', name: 'Шов', min: '1.5' }),
    ).toEqual({});
  });
});

import { describe, expect, it } from 'vitest';

import { validateSewingOperations } from './sewing-operation.validator';

describe('Operation draft validation', () => {
  it('requires positive operation quantity and manual minutes when supplied', () => {
    expect(
      validateSewingOperations([
        {
          clientId: 'op',
          operationId: 0,
          quantity: 0,
          manualMinutes: -1,
          sortOrder: 0,
          reviewed: false,
        },
      ]),
    ).toEqual({
      'operations.0.operationId': 'Оберіть операцію.',
      'operations.0.quantity': 'Вкажіть кількість більше нуля.',
      'operations.0.manualMinutes': 'Вкажіть час більше нуля або залиште поле порожнім.',
    });
  });
});

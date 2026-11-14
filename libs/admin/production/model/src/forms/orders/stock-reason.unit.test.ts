import { describe, expect, it } from 'vitest';

import { validateStockReason } from './stock-reason';

describe('stock reason', () => {
  it('needs a reason of at most 1000 characters', () => {
    expect(validateStockReason('  ')).toBe('Вкажіть причину.');
    expect(validateStockReason('Помилка в записі')).toBeNull();
    expect(validateStockReason('х'.repeat(1001))).toContain('1000');
  });
});

import { describe, expect, it } from 'vitest';

import {
  createProductionWorkValues,
  formatWorkMonth,
  parseWorkTarget,
  productionWorkBody,
  shiftWorkMonth,
  validateProductionWork,
  workLeft,
} from './production-work-form';
import { parseProductionWorkImportFile } from '../../validators/production-work-import-file';

const today = '2026-11-05';

describe('production work form', () => {
  it('limits the plan unless the work is over plan with a reason', () => {
    const values = { ...createProductionWorkValues(today, '3:7'), employeeId: 2, quantity: '4' };
    expect(validateProductionWork(values, today, 3).quantity).toContain('3 шт.');
    expect(validateProductionWork({ ...values, overPlan: true }, today, 3)).toEqual({
      reason: 'Оберіть причину роботи понад план.',
    });
    const over = { ...values, overPlan: true, reason: 'Запас', comment: ' ' };
    expect(validateProductionWork(over, today, 3)).toEqual({});
    expect(productionWorkBody(over)).toEqual({
      employeeId: 2,
      kind: 'Sewing',
      quantity: 4,
      workDate: today,
      overPlan: true,
      reason: 'Запас',
      comment: null,
    });
  });

  it('refuses a future day, an empty target and a fraction', () => {
    const errors = validateProductionWork(
      { ...createProductionWorkValues('2026-11-06'), quantity: '1.5' },
      today,
      null,
    );
    expect(Object.keys(errors).sort()).toEqual(['employeeId', 'quantity', 'target', 'workDate']);
  });

  it('counts what is left and walks months', () => {
    expect(workLeft({ quantity: 5, sewn: 2, cut: 6 }, 'Sewing')).toBe(3);
    expect(workLeft({ quantity: 5, sewn: 2, cut: 6 }, 'Cutting')).toBe(0);
    expect(parseWorkTarget('3:7')).toEqual({ orderId: 3, itemId: 7 });
    expect(parseWorkTarget('')).toBeNull();
    expect(shiftWorkMonth('2026-01', -1)).toBe('2025-12');
    expect(formatWorkMonth('2026-11')).toBe('Листопад 2026');
  });

  it('reads the transfer file', () => {
    expect(parseProductionWorkImportFile('{"rows":[{}]}')).toEqual({
      rows: [{ rows: [{}] }],
      error: null,
    });
    expect(parseProductionWorkImportFile('[]').error).toBe('Потрібен список rows.');
  });
});

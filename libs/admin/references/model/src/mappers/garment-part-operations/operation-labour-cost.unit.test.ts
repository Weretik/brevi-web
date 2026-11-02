import { describe, expect, it } from 'vitest';

import { formatOperationMinutes, operationLabourCost } from './operation-labour-cost';

describe('operation labour cost', () => {
  const rates = { minuteCost: 1.778455, assemblyRate: 0.25 };

  it('prices the norm like the Calculator sheet', () => {
    const cost = operationLabourCost({ min: 6, minutesPerProduct: false }, rates);
    expect(cost?.seamstress).toBeCloseTo(10.67, 2);
    expect(cost?.withAssembly).toBeCloseTo(13.34, 2);
  });

  it('has no cost without a fixed norm or without rates', () => {
    expect(operationLabourCost({ min: 0, minutesPerProduct: true }, rates)).toBeNull();
    expect(operationLabourCost({ min: 6, minutesPerProduct: false }, null)).toBeNull();
  });

  it('formats minutes', () => {
    expect(formatOperationMinutes({ min: 6.5, minutesPerProduct: false })).toBe('6,5 хв');
    expect(formatOperationMinutes({ min: 0, minutesPerProduct: true })).toBe('на виріб');
  });
});

import { describe, expect, it } from 'vitest';

import { financeOperationForms, formatFinanceCount } from './finance-count';

describe('formatFinanceCount', () => {
  it.each([
    [1, '1 операція'],
    [3, '3 операції'],
    [5, '5 операцій'],
    [11, '11 операцій'],
    [14, '14 операцій'],
    [21, '21 операція'],
    [0, '0 операцій'],
  ])('%i', (count, expected) => {
    expect(formatFinanceCount(count, financeOperationForms)).toBe(expected);
  });
});

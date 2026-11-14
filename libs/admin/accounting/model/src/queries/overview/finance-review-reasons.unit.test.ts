import { describe, expect, it } from 'vitest';

import { financeReviewReasons } from './finance-review-reasons';

describe('financeReviewReasons', () => {
  it('names only the reasons that are there', () => {
    expect(financeReviewReasons(2, 1)).toBe(': 2 без категорії, 1 з новим контрагентом');
    expect(financeReviewReasons(0, 3)).toBe(': 3 з новим контрагентом');
    expect(financeReviewReasons(0, 0)).toBe('');
  });
});

import { describe, expect, it } from 'vitest';

import { describeCustomerKeepinSync } from './describe-customer-keepin-sync';

const result = {
  applied: true,
  received: 3,
  created: 1,
  updated: 1,
  unchanged: 1,
  deactivated: [] as string[],
  deleted: [] as string[],
  hiddenInUse: [] as string[],
};

describe('describeCustomerKeepinSync', () => {
  it('summarizes the counts and names clients missing from KeepinCRM', () => {
    expect(describeCustomerKeepinSync(result)).toBe(
      'Оновлено з KeepinCRM: отримано 3, нових 1, оновлено 1, без змін 1.',
    );
    expect(
      describeCustomerKeepinSync({ ...result, deactivated: ['ТОВ Зникле (KeepinCRM 11)'] }),
    ).toContain('Немає в KeepinCRM (позначені як не використовуються): ТОВ Зникле (KeepinCRM 11).');
  });
});

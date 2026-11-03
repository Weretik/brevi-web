import { describe, expect, it } from 'vitest';

import {
  describeCustomerKeepinSync,
  lastCustomerKeepinSync,
} from './describe-customer-keepin-sync';

import type { CustomerSummary } from '../../entities/customers/customer-summary';

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

describe('lastCustomerKeepinSync', () => {
  it('picks the latest sync time and ignores clients without one', () => {
    const rows = [
      { keepinSyncedAt: '2026-11-02T07:00:00Z' },
      { keepinSyncedAt: null },
      { keepinSyncedAt: '2026-11-03T07:00:00Z' },
    ] as CustomerSummary[];
    expect(lastCustomerKeepinSync(rows)).toBe('2026-11-03T07:00:00Z');
    expect(lastCustomerKeepinSync([])).toBeNull();
  });
});

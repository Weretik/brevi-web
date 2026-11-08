import { describe, expect, it } from 'vitest';

import {
  counterpartyFinanceParams,
  counterpartyFinancePeriodProblem,
  emptyCounterpartyFinancePeriod,
} from './finance-counterparty-filters';

describe('«Фінанси» of a counterparty card', () => {
  it('asks for one counterparty, newest first, and leaves empty bounds out', () => {
    expect(
      counterpartyFinanceParams('Supplier', '7', 'Current', emptyCounterpartyFinancePeriod, 1),
    ).toEqual({
      scope: 'Current',
      counterpartyKind: 'Supplier',
      counterpartyId: '7',
      sort: 'Date',
      direction: 'Desc',
      page: 1,
    });
    expect(
      counterpartyFinanceParams('Client', 'c1', 'LegacyArchive', { from: '2025-01-01', to: '' }, 2),
    ).toMatchObject({ scope: 'LegacyArchive', from: '2025-01-01', page: 2 });
  });

  it('refuses a period that ends before it starts', () => {
    expect(counterpartyFinancePeriodProblem({ from: '2026-10-31', to: '2026-10-01' })).toBe(
      'Кінець періоду раніший за початок.',
    );
    expect(counterpartyFinancePeriodProblem({ from: '', to: '2026-10-01' })).toBeNull();
  });
});

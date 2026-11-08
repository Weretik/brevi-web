import { financeCounterpartyTabs } from '../../entities/counterparties/finance-counterparty';

import type { LedgerScope } from '../../entities/categories/finance-category';
import type { FinanceCounterpartyTab } from '../../entities/counterparties/finance-counterparty';

const tabParams: Record<FinanceCounterpartyTab, string> = {
  Financial: 'financial',
  Clients: 'clients',
  Suppliers: 'suppliers',
  Oneoffs: 'oneoffs',
};

/** `?tab=` of «Контрагенти»: «Фінансові» by default. */
export function counterpartyTabOfParam(param: string | null): FinanceCounterpartyTab {
  return financeCounterpartyTabs.find((tab) => tabParams[tab] === param) ?? 'Financial';
}

export const counterpartyTabParam = (tab: FinanceCounterpartyTab): Record<string, string> =>
  tab === 'Financial' ? {} : { tab: tabParams[tab] };

export interface FinanceCounterpartyQuery {
  tab: FinanceCounterpartyTab;
  search: string;
  includeArchived: boolean;
  /** From 1. */
  page: number;
}

export function financeCounterpartyParams(
  query: FinanceCounterpartyQuery,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = { tab: query.tab, page: query.page };
  if (query.search.trim()) params['search'] = query.search.trim();
  if (query.includeArchived) params['includeArchived'] = true;
  return params;
}

/** «Фінанси» of a client or supplier card: a period as typed; empty bounds mean no limit. */
export interface CounterpartyFinancePeriod {
  from: string;
  to: string;
}

export const emptyCounterpartyFinancePeriod: CounterpartyFinancePeriod = { from: '', to: '' };

/** A message for a period that cannot be applied, or null. */
export const counterpartyFinancePeriodProblem = (
  period: CounterpartyFinancePeriod,
): string | null =>
  period.from && period.to && period.to < period.from ? 'Кінець періоду раніший за початок.' : null;

/** Query of `GET /api/accounting/transactions` for one client or supplier, newest first. */
export function counterpartyFinanceParams(
  kind: 'Client' | 'Supplier',
  id: string,
  scope: LedgerScope,
  period: CounterpartyFinancePeriod,
  page: number,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    scope,
    counterpartyKind: kind,
    counterpartyId: id,
    sort: 'Date',
    direction: 'Desc',
    page,
  };
  if (period.from) params['from'] = period.from;
  if (period.to) params['to'] = period.to;
  return params;
}

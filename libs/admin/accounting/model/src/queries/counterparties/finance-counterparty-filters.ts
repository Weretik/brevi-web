import { financeCounterpartyTabs } from '../../entities/counterparties/finance-counterparty';

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

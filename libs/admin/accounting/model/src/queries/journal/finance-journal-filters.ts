import { parseMoneyToMinor } from '../../mappers/money/finance-money';

import type { CategoryDirection, LedgerScope } from '../../entities/categories/finance-category';
import type {
  FinanceJournalSort,
  FinanceSortDirection,
} from '../../entities/movements/finance-movement';

/** Filters of «Операції» and «Перекази» as typed; they apply only on «Застосувати». */
export interface FinanceJournalFilter {
  from: string;
  to: string;
  accountId: string;
  /** Operations only; empty — both. */
  type: CategoryDirection | '';
  /** Operations only: a root takes its subcategories. */
  categoryId: string;
  subcategoryId: string;
  search: string;
  /** Hryvnias as typed. */
  min: string;
  max: string;
  includeVoided: boolean;
}

/** Start of «Домашня бухгалтерія» in the old Calculator. */
export const legacyArchiveStart = '2010-01-01';

/** `?tab=archive` opens «Домашня бухгалтерія». */
export const ledgerScopeOfTab = (tab: string | null): LedgerScope =>
  tab === 'archive' ? 'LegacyArchive' : 'Current';

export const ledgerTabOfScope = (scope: LedgerScope): Record<string, string> =>
  scope === 'Current' ? {} : { tab: 'archive' };

/** The day before a YYYY-MM-DD date. */
export function previousDay(date: string): string {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() - 1);
  return day.toISOString().slice(0, 10);
}

/** The whole area: the current books from the cutover to today, the archive up to the cutover. */
export function defaultFinanceJournalFilter(
  scope: LedgerScope,
  cutoverDate: string,
  today: string,
): FinanceJournalFilter {
  return {
    from: scope === 'Current' ? cutoverDate : legacyArchiveStart,
    to:
      scope === 'Current' ? (today < cutoverDate ? cutoverDate : today) : previousDay(cutoverDate),
    accountId: '',
    type: '',
    categoryId: '',
    subcategoryId: '',
    search: '',
    min: '',
    max: '',
    includeVoided: false,
  };
}

/** A message for filters that cannot be applied, or null. */
export function financeJournalFilterProblem(filter: FinanceJournalFilter): string | null {
  if (filter.from && filter.to && filter.to < filter.from)
    return 'Кінець періоду раніший за початок.';
  const min = filter.min.trim() ? parseMoneyToMinor(filter.min) : 0;
  const max = filter.max.trim() ? parseMoneyToMinor(filter.max) : 0;
  if (min === null || max === null) return 'Суму вкажіть числом, наприклад 1 250,40.';
  if (filter.min.trim() && filter.max.trim() && (max ?? 0) < (min ?? 0))
    return 'Сума «до» менша за суму «від».';
  return null;
}

type Params = Record<string, string | number | boolean>;

function common(
  scope: LedgerScope,
  filter: FinanceJournalFilter,
  sort: FinanceJournalSort,
  direction: FinanceSortDirection,
  page: number,
): Params {
  const params: Params = { scope, sort, direction, page };
  if (filter.from) params['from'] = filter.from;
  if (filter.to) params['to'] = filter.to;
  if (filter.accountId) params['accountId'] = filter.accountId;
  if (filter.search.trim()) params['search'] = filter.search.trim();
  const min = filter.min.trim() ? parseMoneyToMinor(filter.min) : null;
  const max = filter.max.trim() ? parseMoneyToMinor(filter.max) : null;
  if (min !== null) params['minMinor'] = min;
  if (max !== null) params['maxMinor'] = max;
  if (filter.includeVoided) params['includeVoided'] = true;
  return params;
}

/** Query of `GET /api/accounting/transactions`. */
export function financeTransactionParams(
  scope: LedgerScope,
  filter: FinanceJournalFilter,
  sort: FinanceJournalSort,
  direction: FinanceSortDirection,
  page: number,
): Params {
  const params = common(scope, filter, sort, direction, page);
  if (filter.type) params['type'] = filter.type;
  if (filter.subcategoryId) params['subcategoryId'] = filter.subcategoryId;
  else if (filter.categoryId) params['categoryId'] = filter.categoryId;
  return params;
}

/** Query of `GET /api/accounting/transfers`. */
export const financeTransferParams = common;

/** How many filters differ from the defaults, for the «Фільтри» button. */
export function countFinanceJournalFilters(
  filter: FinanceJournalFilter,
  defaults: FinanceJournalFilter,
): number {
  return (Object.keys(filter) as (keyof FinanceJournalFilter)[]).filter(
    (key) => key !== 'subcategoryId' && filter[key] !== defaults[key],
  ).length;
}

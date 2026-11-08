import type {
  CategoryDirection,
  FinanceCategory,
  LedgerScope,
} from '../../entities/categories/finance-category';
import type { FinanceCounterpartyChoice } from '../../entities/counterparties/finance-counterparty';
import type { FinanceReportKind } from '../../entities/reports/finance-report';

/** The «Звіти» form; `scope` '' takes both areas. The report changes only on «Сформувати звіт». */
export interface FinanceReportFilter {
  kind: FinanceReportKind;
  from: string;
  to: string;
  scope: LedgerScope | '';
  accountId: string;
  type: CategoryDirection | '';
  /** A root with its subcategories; needs the type and the area. */
  categoryId: string;
  counterparty: FinanceCounterpartyChoice | null;
}

/** This month of the current books, from the cutover at most, up to today. */
export function defaultFinanceReportFilter(
  today: string,
  cutoverDate: string,
): FinanceReportFilter {
  const first = `${today.slice(0, 7)}-01`;
  return {
    kind: 'Summary',
    from: first < cutoverDate ? cutoverDate : first,
    to: today,
    scope: 'Current',
    accountId: '',
    type: '',
    categoryId: '',
    counterparty: null,
  };
}

/** A message for a form that cannot be built, or null. */
export function financeReportFilterProblem(filter: FinanceReportFilter): string | null {
  if (!filter.from || !filter.to) return 'Вкажіть період.';
  if (filter.to < filter.from) return 'Кінець періоду раніший за початок.';
  return null;
}

/** «Структура витрат» is always about expenses, so it has no type of its own. */
export const financeReportHasType = (kind: FinanceReportKind) => kind !== 'ExpenseStructure';

/** Query of `GET /api/accounting/reports` and `/reports/csv`. */
export function financeReportParams(filter: FinanceReportFilter): Record<string, string> {
  const params: Record<string, string> = { kind: filter.kind, from: filter.from, to: filter.to };
  if (filter.scope) params['scope'] = filter.scope;
  if (filter.accountId) params['accountId'] = filter.accountId;
  const type = financeReportHasType(filter.kind) ? filter.type : 'Expense';
  if (type && financeReportHasType(filter.kind)) params['type'] = type;
  if (filter.categoryId && filter.scope && type) params['categoryId'] = filter.categoryId;
  if (filter.counterparty) {
    params['counterpartyKind'] = filter.counterparty.kind;
    params['counterpartyId'] = filter.counterparty.id;
  }
  return params;
}

/** Root categories a report may narrow to: switched-off ones too, since reports look back. */
export function financeReportRoots(
  categories: readonly FinanceCategory[],
  filter: FinanceReportFilter,
): { id: string; name: string }[] {
  const type = financeReportHasType(filter.kind) ? filter.type : 'Expense';
  if (!filter.scope || !type) return [];
  return categories
    .filter((row) => row.scope === filter.scope && row.direction === type && row.parentId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'uk'))
    .map((row) => ({ id: row.id, name: row.active ? row.name : `${row.name} (вимкнена)` }));
}

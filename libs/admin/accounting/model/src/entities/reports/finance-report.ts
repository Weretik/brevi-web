import type { CategoryDirection } from '../categories/finance-category';
import type { MovementSource } from '../movements/finance-movement';

export const financeReportKinds = [
  'Summary',
  'ExpenseStructure',
  'Categories',
  'Accounts',
  'Counterparties',
  'Operations',
] as const;
export type FinanceReportKind = (typeof financeReportKinds)[number];

export const financeReportKindLabels: Record<FinanceReportKind, string> = {
  Summary: 'Зведений',
  ExpenseStructure: 'Структура витрат',
  Categories: 'За категоріями',
  Accounts: 'За рахунками',
  Counterparties: 'За контрагентами',
  Operations: 'Журнал операцій',
};

/** One line under the report choice: what the report answers. */
export const financeReportKindHints: Record<FinanceReportKind, string> = {
  Summary: 'Доходи, витрати й різниця за період.',
  ExpenseStructure: 'Куди пішли гроші: категорії витрат із підкатегоріями.',
  Categories: 'Доходи й витрати по кожній категорії та підкатегорії.',
  Accounts: 'Рух кожного рахунку: доходи, витрати й перекази. Це рух за період, не залишок.',
  Counterparties: 'З ким і скільки: доходи й витрати по контрагентах.',
  Operations: 'Самі операції, від найдавніших. На екрані перші 100, у CSV до 50 000.',
};

export const financeReportRowTypes = ['Group', 'Subcategory', 'Operation'] as const;
export type FinanceReportRowType = (typeof financeReportRowTypes)[number];

/** Income and expense of one currency, kopecks; transfers are never counted. */
export interface FinanceReportTotal {
  currency: string;
  operations: number;
  incomeMinor: number;
  expenseMinor: number;
  resultMinor: number;
}

/**
 * A row of a report; fields the kind does not use are null. A Group row of «Структура витрат»
 * already holds its Subcategory rows. `resultMinor` of «За рахунками» includes transfers.
 */
export interface FinanceReportRow {
  rowType: FinanceReportRowType;
  currency: string;
  operations: number;
  incomeMinor: number;
  expenseMinor: number;
  resultMinor: number;
  account: string | null;
  type: CategoryDirection | null;
  category: string | null;
  subcategory: string | null;
  counterparty: string | null;
  incomingTransfersMinor: number | null;
  outgoingTransfersMinor: number | null;
  date: string | null;
  amountMinor: number | null;
  note: string | null;
  source: MovementSource | null;
  id: string | null;
}

/** A built report; for «Журнал операцій» `limited` says more rows exist than `rows`. */
export interface FinanceReport {
  kind: FinanceReportKind;
  from: string;
  to: string;
  totals: FinanceReportTotal[];
  rows: FinanceReportRow[];
  totalRows: number;
  limited: boolean;
}

const slugs: Record<FinanceReportKind, string> = {
  Summary: 'zvedenyi',
  ExpenseStructure: 'struktura-vytrat',
  Categories: 'kategorii',
  Accounts: 'rakhunky',
  Counterparties: 'kontrahenty',
  Operations: 'operatsii',
};

/** The CSV file name the backend gives the same report. */
export const financeReportFileName = (kind: FinanceReportKind, from: string, to: string) =>
  `zvit-${slugs[kind]}-${from}-${to}.csv`;

/** The backup file name of a Kyiv day. */
export const financeExportFileName = (today: string) => `brevi-finance-${today}.json`;

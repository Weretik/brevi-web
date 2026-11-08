import type { CategoryDirection } from '../categories/finance-category';
import type {
  FinanceCounterpartyLink,
  FinanceCounterpartyRef,
} from '../counterparties/finance-counterparty';

export const bankStatementStatuses = ['Preview', 'Booked'] as const;
export type BankStatementStatus = (typeof bankStatementStatuses)[number];

/** How the server sees a line, from the most urgent: an error first, a ready line last. */
export const bankLineStates = [
  'Error',
  'Duplicate',
  'NeedsCategory',
  'NewCounterparty',
  'Transfer',
  'Ready',
] as const;
export type BankLineState = (typeof bankLineStates)[number];

export const bankLineStateLabels: Record<BankLineState, string> = {
  Error: 'Помилки',
  Duplicate: 'Дублікати',
  NeedsCategory: 'Без категорії',
  NewCounterparty: 'Новий контрагент',
  Transfer: 'Перекази',
  Ready: 'Готові до проведення',
};

/** A problem of a line for the table; ready lines and transfers carry no mark. */
export const bankLineProblemLabels: Partial<Record<BankLineState, string>> = {
  Error: 'Помилка',
  NeedsCategory: 'Без категорії',
  NewCounterparty: 'Новий контрагент',
};

export const bankDuplicates = ['None', 'Probable', 'Exact'] as const;
export type BankDuplicate = (typeof bankDuplicates)[number];

export const bankDuplicateLabels: Record<Exclude<BankDuplicate, 'None'>, string> = {
  Probable: 'Схоже на дублікат',
  Exact: 'Уже в обліку',
};

/** A PrivatBank export: XLSX, XLS or CSV, at most 12 MB (BreviERP `BankStatement.MaxBytes`). */
export const bankStatementFileLimits = {
  accept: '.xlsx,.xls,.csv',
  extensions: ['.xlsx', '.xls', '.csv'],
  maxBytes: 12 * 1024 * 1024,
} as const;

/** Lines per page of one statement (BreviERP `GetBankStatementQuery`). */
export const bankStatementPageSize = 100;

/** An uploaded statement of one account; `existing` — the same file was uploaded before. */
export interface BankStatement {
  id: string;
  accountId: string;
  accountName: string;
  fileName: string;
  status: BankStatementStatus;
  lineCount: number;
  firstDate: string | null;
  lastDate: string | null;
  transactionCount: number;
  transferCount: number;
  createdBy: string;
  createdAt: string;
  bookedBy: string | null;
  bookedAt: string | null;
  version: number;
  existing: boolean;
}

/** One row of the bank file with what Brevi recognised and what the director chose. */
export interface BankStatementLine {
  id: string;
  rowNumber: number;
  /** Null only on a line with an error. */
  date: string | null;
  time: string | null;
  type: CategoryDirection | null;
  amountMinor: number | null;
  currency: string | null;
  bankName: string;
  edrpou: string;
  iban: string;
  purpose: string;
  document: string;
  bankId: string | null;
  error: string;
  duplicate: BankDuplicate;
  duplicateNote: string;
  transferAccountId: string | null;
  transferAccountName: string | null;
  counterparty: FinanceCounterpartyRef | null;
  categoryId: string | null;
  categoryRootId: string | null;
  categoryRootName: string | null;
  subcategoryName: string | null;
  oneoffName: string;
  description: string;
  comment: string;
  excluded: boolean;
  state: BankLineState;
  /** «Провести виписку» turns it into an operation or a transfer. */
  willBook: boolean;
  transactionId: string | null;
  transferId: string | null;
}

export interface BankLineStateCount {
  state: BankLineState;
  count: number;
}

/** What «Провести виписку» will write: operations with their sums, and transfers. */
export interface BankStatementTotals {
  operations: number;
  incomeMinor: number;
  expenseMinor: number;
  transfers: number;
}

/**
 * What «Відкотити виписку» would do to a booked statement: active operations and transfers to cancel, how many of
 * them were changed by hand after the booking, and how many are cancelled already.
 */
export interface BankStatementRollback {
  transactions: number;
  transfers: number;
  changed: number;
  cancelled: number;
}

/** One page of a statement's lines, filtered by state, with counts of every state. */
export interface BankStatementDetails {
  statement: BankStatement;
  states: BankLineStateCount[];
  totals: BankStatementTotals;
  lines: BankStatementLine[];
  total: number;
  page: number;
  pageSize: number;
  /** Only for a booked statement. */
  rollback: BankStatementRollback | null;
}

/** Body of «Зберегти» of one line. */
export interface BankStatementLineBody {
  categoryId: string | null;
  counterparty: FinanceCounterpartyLink | null;
  oneoffName: string | null;
  description: string | null;
  comment: string | null;
  excluded: boolean;
}

/** «01.10.2026 – 31.10.2026», one date, or «—». */
export function bankStatementPeriod(statement: Pick<BankStatement, 'firstDate' | 'lastDate'>) {
  const format = (date: string) => date.split('-').reverse().join('.');
  const { firstDate, lastDate } = statement;
  if (!firstDate || !lastDate) return '—';
  return firstDate === lastDate ? format(firstDate) : `${format(firstDate)} – ${format(lastDate)}`;
}

/** A file the server will not take: wrong type, empty or too large. */
export function bankStatementFileProblem(file: Pick<File, 'name' | 'size'>): string | null {
  const name = file.name.toLowerCase();
  if (!bankStatementFileLimits.extensions.some((extension) => name.endsWith(extension)))
    return 'Оберіть виписку у форматі XLSX, XLS або CSV.';
  if (file.size === 0) return 'Файл порожній.';
  if (file.size > bankStatementFileLimits.maxBytes)
    return 'Файл більший за 12 МБ. Розділіть виписку на частини.';
  return null;
}

/** The confirmation of «Відкотити виписку»: what is cancelled, what was changed by hand, what stays. */
export function bankStatementRollbackText(rollback: BankStatementRollback): string {
  const parts = [
    `Буде анульовано ${rollback.transactions} операцій і ${rollback.transfers} переказів цієї виписки; у журналі вони лишаться закресленими.`,
  ];
  if (rollback.changed > 0)
    parts.push(
      `${rollback.changed} з них змінювали вручну після проведення — ці зміни теж буде анульовано.`,
    );
  if (rollback.cancelled > 0)
    parts.push(`${rollback.cancelled} уже анульовано раніше; їх не чіпаємо.`);
  parts.push(
    'Нові непідтверджені контрагенти виписки підуть в архів, якщо їх більше ніде не використано. Виписка знову стане чернеткою: її можна виправити й провести заново.',
  );
  return parts.join(' ');
}

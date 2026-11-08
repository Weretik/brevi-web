import { formatLedgerDate, formatMinor } from '../../mappers/money/finance-money';
import { categoryDirectionLabels } from '../categories/finance-category';

import type { AuditEntity, FinanceHistoryEntry } from '../history/finance-history-entry';

export const auditEntityLabels: Record<AuditEntity, string> = {
  Account: 'Рахунок',
  Category: 'Категорія',
  Transaction: 'Операція',
  Transfer: 'Переказ',
  Counterparty: 'Контрагент',
};

/** One change of any record in «Журнал змін»; `title` names the record as it was. */
export interface FinanceAuditEntry extends FinanceHistoryEntry {
  title: string;
}

export interface FinanceAuditPage {
  items: FinanceAuditEntry[];
  total: number;
  page: number;
  pageSize: number;
}

/** A field that changed: values already formatted for reading, «—» for empty. */
export interface FinanceAuditChange {
  field: string;
  before: string;
  after: string;
}

const fieldLabels: Record<string, string> = {
  name: 'Назва',
  date: 'Дата',
  type: 'Тип',
  amountMinor: 'Сума',
  currency: 'Валюта',
  accountName: 'Рахунок',
  fromAccountName: 'З рахунку',
  toAccountName: 'На рахунок',
  categoryRootName: 'Категорія',
  subcategoryName: 'Підкатегорія',
  counterparty: 'Контрагент',
  oneoffName: 'Разовий контрагент',
  description: 'Опис',
  comment: 'Коментар',
  note: 'Примітка',
  status: 'Стан',
  verification: 'Перевірка',
  active: 'Активний',
  verified: 'Підтверджений',
  edrpou: 'ЄДРПОУ',
  iban: 'IBAN',
  bankName: 'Назва в банку',
  aliases: 'Інші назви',
  autoApplyCategory: 'Ставити категорію сама',
  openingMinor: 'Початковий залишок',
  openingDate: 'Дата початкового залишку',
  cutoverBalanceMinor: 'Залишок на 01.10',
  cutoverConfirmed: 'Залишок на 01.10 підтверджено',
  sortOrder: 'Порядок',
  fileName: 'Файл',
  sizeBytes: 'Розмір, байт',
};

const valueLabels: Record<string, string> = {
  ...categoryDirectionLabels,
  Active: 'Діє',
  Void: 'Анульовано',
  Verified: 'Перевірено',
  NeedsCategory: 'Без категорії',
  NeedsCounterpartyReview: 'Перевірити контрагента',
  Bank: 'Банк',
  Card: 'Картка',
  Cash: 'Каса',
  Other: 'Інше',
};

function parse(json: string | null): Record<string, unknown> {
  if (!json) return {};
  try {
    const value: unknown = JSON.parse(json);
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function show(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Так' : 'Ні';
  if (typeof value === 'number') return key.endsWith('Minor') ? formatMinor(value) : String(value);
  if (Array.isArray(value))
    return value.length ? value.map((item) => show('', item)).join(', ') : '—';
  if (typeof value === 'object') {
    const name = (value as { name?: unknown }).name;
    return typeof name === 'string' && name ? name : '—';
  }
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return formatLedgerDate(text);
  return valueLabels[text] ?? text;
}

/**
 * What changed between the snapshots, in a fixed field order; a new record lists its filled fields,
 * a removed one the fields it had. Ids, versions and times are left out.
 */
export function financeAuditChanges(entry: FinanceHistoryEntry): FinanceAuditChange[] {
  const before = parse(entry.beforeJson);
  const after = parse(entry.afterJson);
  return Object.keys(fieldLabels)
    .filter((key) => key in before || key in after)
    .map((key) => ({
      field: fieldLabels[key] ?? key,
      before: entry.beforeJson ? show(key, before[key]) : '—',
      after: entry.afterJson ? show(key, after[key]) : '—',
    }))
    .filter((change) => change.before !== change.after);
}

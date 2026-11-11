import {
  boolean,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableDateTime,
  nullableText,
  record,
  text,
} from '../validators/warehouse-response';

import type {
  StockTransferCurrent,
  StockTransferProblem,
  StockTransferResult,
  StockTransferSource,
  StockTransferTarget,
} from '@admin/warehouse/model';

const counts = <K extends string>(value: unknown, keys: readonly K[], what: string) => {
  const row = record(value, what);
  return Object.fromEntries(
    keys.map((key) => [key, integer(row[key], `${what}: ${key}`)]),
  ) as Record<K, number>;
};

const source = (value: unknown): StockTransferSource => ({
  ...counts(
    value,
    [
      'lines',
      'pairs',
      'movements',
      'openings',
      'receipts',
      'issues',
      'adjustments',
      'voided',
      'revisions',
      'packages',
      'issueLines',
      'reservations',
      'negativePairs',
      'zeroPairs',
    ] as const,
    'вигрузка',
  ),
  meters: decimal(record(value)['meters'], 'метри вигрузки'),
});

const target = (value: unknown): StockTransferTarget | null =>
  value === null || value === undefined
    ? null
    : {
        ...counts(
          value,
          ['lines', 'movements', 'revisions', 'issues', 'issueLines', 'plans'] as const,
          'що отримає Brevi',
        ),
        meters: decimal(record(value)['meters'], 'метри Brevi'),
      };

const current = (value: unknown): StockTransferCurrent =>
  counts(
    value,
    ['lines', 'movements', 'issues', 'plans', 'ownLines', 'ownMovements', 'ownIssues'] as const,
    'склад зараз',
  );

const problem = (value: unknown): StockTransferProblem => {
  const row = record(value, 'зауваження');
  return {
    table: text(row['table'], 'таблиця'),
    rowId: nullableText(row['rowId'], 'рядок'),
    message: nonEmptyText(row['message'], 'текст зауваження'),
  };
};

export function mapStockTransferResult(value: unknown): StockTransferResult {
  const row = record(value, 'перенесення');
  return {
    applied: boolean(row['applied'], 'перенесено'),
    unchanged: boolean(row['unchanged'], 'без змін'),
    hash: nonEmptyText(row['hash'], 'хеш'),
    source: source(row['source']),
    target: target(row['target']),
    current: current(row['current']),
    needsConfirmation: boolean(row['needsConfirmation'], 'потрібне підтвердження'),
    errors: list(row['errors'], 'помилки').map(problem),
    notes: list(row['notes'], 'зауваження').map(problem),
    lastTransferAt: nullableDateTime(row['lastTransferAt'], 'останнє перенесення'),
  };
}

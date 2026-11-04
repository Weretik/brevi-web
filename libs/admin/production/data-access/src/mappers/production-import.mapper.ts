import {
  boolean,
  integer,
  list,
  nullableText,
  record,
  text,
} from '../validators/production-response';

import type { ProductionImportAction, ProductionImportResult } from '@admin/production/model';

const actions: readonly ProductionImportAction[] = ['created', 'updated', 'unchanged', 'error'];

function action(value: unknown): ProductionImportAction {
  const result = text(value, 'дія імпорту');
  if (!actions.includes(result as ProductionImportAction))
    throw new Error('Некоректна відповідь цеху: дія імпорту.');
  return result as ProductionImportAction;
}

function summary(row: Record<string, unknown>) {
  return {
    dryRun: boolean(row['dryRun'], 'перегляд'),
    created: integer(row['created'], 'додано'),
    updated: integer(row['updated'], 'оновлено'),
    unchanged: integer(row['unchanged'], 'без змін'),
  };
}

export function mapStaffImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  return {
    ...summary(row),
    errors: 0,
    lines: list(row['lines'], 'рядки імпорту').map((item) => {
      const line = record(item, 'рядок імпорту');
      return {
        key: text(line['fullName'], 'ПІБ'),
        detail: text(line['position'], 'посада'),
        action: action(line['action']),
        error: null,
      };
    }),
  };
}

export function mapFabricNormImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  return {
    ...summary(row),
    errors: integer(row['errors'], 'помилки'),
    lines: list(row['lines'], 'рядки імпорту').map((item) => {
      const line = record(item, 'рядок імпорту');
      return {
        key: text(line['modelCode'], 'код моделі'),
        detail: nullableText(line['modelName'], 'назва моделі'),
        action: action(line['action']),
        error: nullableText(line['error'], 'помилка'),
      };
    }),
  };
}

/** Moved orders shown in the shared import preview: «№ 12» and the client with its items. */
export function mapOrderImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  return {
    dryRun: boolean(row['dryRun'], 'перегляд'),
    created: integer(row['created'], 'додано'),
    updated: 0,
    unchanged: integer(row['unchanged'], 'без змін'),
    errors: integer(row['errors'], 'помилки'),
    lines: list(row['lines'], 'рядки імпорту').map((item) => {
      const line = record(item, 'рядок імпорту');
      return {
        key: `№ ${integer(line['number'], 'номер', 1)}`,
        detail: `${text(line['clientName'], 'клієнт')} · позицій: ${integer(line['items'], 'позицій')}`,
        action: action(line['action']),
        error: nullableText(line['error'], 'помилка'),
      };
    }),
  };
}

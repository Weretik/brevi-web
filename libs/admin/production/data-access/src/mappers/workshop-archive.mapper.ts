import {
  boolean,
  day,
  integer,
  list,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/production-response';

import type {
  ProductionImportResult,
  WorkshopArchivePage,
  WorkshopArchiveRow,
} from '@admin/production/model';

const kinds = ['Schedule', 'Request'] as const;

function mapRow(value: unknown): WorkshopArchiveRow {
  const row = record(value, 'рядок архіву');
  return {
    id: integer(row['id'], 'id рядка', 1),
    sourceRow: integer(row['sourceRow'], 'рядок старої книги', 1),
    date: row['date'] === null || row['date'] === undefined ? null : day(row['date'], 'дата'),
    dateText: nullableText(row['dateText'], 'дата як записано'),
    number: nullableText(row['number'], 'номер'),
    client: nullableText(row['client'], 'замовник'),
    product: nullableText(row['product'], 'виріб'),
    quantity: nullableText(row['quantity'], 'кількість'),
    fabric: nullableText(row['fabric'], 'тканина'),
    status: nullableText(row['status'], 'стан'),
    notes: nullableText(row['notes'], 'примітки'),
    fields: list(row['fields'], 'поля').map((item) => {
      const field = record(item, 'поле');
      return { label: text(field['label'], 'назва поля'), value: text(field['value'], 'значення') };
    }),
    links: list(row['links'], 'посилання').map((item) => {
      const link = record(item, 'посилання');
      return { label: text(link['label'], 'назва посилання'), url: text(link['url'], 'адреса') };
    }),
  };
}

export function mapWorkshopArchivePage(value: unknown): WorkshopArchivePage {
  const page = record(value, 'архів');
  return {
    kind: oneOf(page['kind'], kinds, 'розділ архіву'),
    page: integer(page['page'], 'сторінка', 1),
    pageSize: integer(page['pageSize'], 'розмір сторінки', 1),
    total: integer(page['total'], 'усього'),
    items: list(page['items'], 'рядки архіву').map(mapRow),
  };
}

/** The archive import in the shared preview: how many lines are new; only errors are listed. */
export function mapWorkshopArchiveImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  return {
    dryRun: boolean(row['dryRun'], 'перегляд'),
    created: integer(row['created'], 'нових'),
    updated: 0,
    unchanged: integer(row['unchanged'], 'вже в архіві'),
    errors: integer(row['errors'], 'помилки'),
    lines: list(row['errorLines'], 'помилки імпорту').map((item) => {
      const line = record(item, 'помилка імпорту');
      return {
        key: text(line['sourceKey'], 'рядок'),
        detail: null,
        action: 'error' as const,
        error: text(line['error'], 'помилка'),
      };
    }),
  };
}

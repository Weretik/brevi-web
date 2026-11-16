import type {
  ActivityChange,
  ActivityEntriesPage,
  ActivityEntry,
  ActivityFilterOptions,
} from '@admin/activity-log/model';

const invalid = (what: string) => new Error(`Некоректна відповідь API журналу дій: ${what}.`);

function record(value: unknown, what: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(what);
  return value as Record<string, unknown>;
}

function list(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw invalid(what);
  return value;
}

function text(value: unknown, what: string): string {
  if (typeof value !== 'string') throw invalid(what);
  return value;
}

function nullableText(value: unknown, what: string): string | null {
  return value === null || value === undefined ? null : text(value, what);
}

function integer(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw invalid(what);
  return value;
}

function mapChange(value: unknown): ActivityChange {
  const row = record(value, 'зміна');
  return {
    field: text(row['field'], 'поле'),
    from: nullableText(row['from'], 'було'),
    to: nullableText(row['to'], 'стало'),
  };
}

export function mapActivityEntry(value: unknown): ActivityEntry {
  const row = record(value, 'запис');
  return {
    id: text(row['id'], 'id'),
    occurredAt: text(row['occurredAt'], 'час'),
    actorId: integer(row['actorId'], 'хто'),
    actorName: text(row['actorName'], 'ім’я'),
    actorRoles: list(row['actorRoles'], 'ролі').map((role) => text(role, 'роль')),
    action: text(row['action'], 'дія'),
    subjectType: text(row['subjectType'], 'тип об’єкта'),
    subjectTypeTitle: text(row['subjectTypeTitle'], 'назва типу'),
    subjectId: text(row['subjectId'], 'id об’єкта'),
    subjectTitle: text(row['subjectTitle'], 'об’єкт'),
    summary: nullableText(row['summary'], 'опис'),
    changes: list(row['changes'], 'зміни').map(mapChange),
  };
}

export function mapActivityEntriesPage(value: unknown): ActivityEntriesPage {
  const row = record(value, 'сторінка');
  return {
    items: list(row['items'], 'записи').map(mapActivityEntry),
    page: integer(row['page'], 'сторінка'),
    pageSize: integer(row['pageSize'], 'розмір сторінки'),
    total: integer(row['total'], 'усього'),
  };
}

export function mapActivityFilterOptions(value: unknown): ActivityFilterOptions {
  const row = record(value, 'фільтри');
  return {
    actors: list(row['actors'], 'люди').map((actor) => {
      const item = record(actor, 'людина');
      return { id: integer(item['id'], 'id людини'), name: text(item['name'], 'ім’я') };
    }),
    subjectTypes: list(row['subjectTypes'], 'типи').map((type) => {
      const item = record(type, 'тип');
      return { key: text(item['key'], 'ключ типу'), title: text(item['title'], 'назва типу') };
    }),
    actions: list(row['actions'], 'дії').map((action) => text(action, 'дія')),
  };
}

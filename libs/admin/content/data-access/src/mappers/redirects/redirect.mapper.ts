import { siteRedirectSources } from '@admin/content/model';

import {
  dateTime,
  flag,
  integer,
  list,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/content-response';

import type { RedirectImportReport, RedirectImportRow, SiteRedirect } from '@admin/content/model';

const results = ['Created', 'Updated', 'Kept', 'Same', 'Unresolved'] as const;

export function mapRedirect(value: unknown): SiteRedirect {
  const row = record(value, 'переадресація');
  return {
    id: integer(row['id'], 'id переадресації', 1),
    fromPath: text(row['fromPath'], 'стара адреса'),
    toPath: text(row['toPath'], 'нова адреса'),
    source: oneOf(row['source'], siteRedirectSources, 'джерело переадресації'),
    note: nullableText(row['note'], 'примітка'),
    updatedAtUtc: dateTime(row['updatedAtUtc'], 'час зміни'),
    updatedBy: text(row['updatedBy'], 'хто змінив'),
  };
}

export function mapRedirectList(value: unknown): SiteRedirect[] {
  return list(record(value, 'список переадресацій')['items'], 'переадресації').map(mapRedirect);
}

function mapImportRow(value: unknown): RedirectImportRow {
  const row = record(value, 'адреса перенесення');
  return {
    fromPath: text(row['fromPath'], 'стара адреса'),
    toPath: nullableText(row['toPath'], 'нова адреса'),
    note: nullableText(row['note'], 'примітка'),
    result: oneOf(row['result'], results, 'результат'),
  };
}

export function mapRedirectImportReport(value: unknown): RedirectImportReport {
  const report = record(value, 'звіт перенесення адрес');
  return {
    dryRun: flag(report['dryRun'], 'перевірка'),
    total: integer(report['total'], 'усього'),
    created: integer(report['created'], 'створено'),
    updated: integer(report['updated'], 'оновлено'),
    kept: integer(report['kept'], 'залишено'),
    unresolved: integer(report['unresolved'], 'не знайдено'),
    rows: list(report['rows'], 'адреси').map(mapImportRow),
  };
}

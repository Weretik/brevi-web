import {
  articleImportBatchSize,
  articleImportMaxItems,
} from '../../entities/articles/article-import';

import type { ArticleImportReport } from '../../entities/articles/article-import';
import type { OldSiteImportItems } from '../../entities/product-pages/old-site-import';

export type ArticleImportFile =
  { ok: true; items: OldSiteImportItems } | { ok: false; message: string };

const isArticle = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof (value as Record<string, unknown>)['slug'] === 'string' &&
  typeof (value as Record<string, unknown>)['publishedOn'] === 'string';

/** Reads the article transfer file: `{ items: [...] }` or the list itself; every article needs its address and date. */
export function readArticleImportFile(content: string): ArticleImportFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, message: 'Файл не є JSON. Потрібен файл перенесення статей.' };
  }
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)['items']
      : null;
  if (!Array.isArray(items) || items.length === 0)
    return { ok: false, message: 'У файлі немає статей старого сайту.' };
  if (items.length > articleImportMaxItems)
    return {
      ok: false,
      message: `У файлі ${items.length} статей, а за один раз можна перенести до ${articleImportMaxItems}.`,
    };
  if (!items.every(isArticle))
    return {
      ok: false,
      message:
        'У файлі є запис без адреси або дати. Схоже, це файл перенесення товарів чи розділів, а не статей.',
    };
  return { ok: true, items };
}

/** The file in parts small enough for one request of the real transfer. */
export function articleImportBatches(items: OldSiteImportItems): OldSiteImportItems[] {
  const batches: OldSiteImportItems[] = [];
  for (let start = 0; start < items.length; start += articleImportBatchSize)
    batches.push(items.slice(start, start + articleImportBatchSize));
  return batches;
}

/** One report for the whole file out of the reports of its parts. */
export function sumArticleImportReports(
  reports: readonly ArticleImportReport[],
): ArticleImportReport {
  const sum = (pick: (report: ArticleImportReport) => number) =>
    reports.reduce((total, report) => total + pick(report), 0);
  return {
    dryRun: reports.some((report) => report.dryRun),
    total: sum((report) => report.total),
    created: sum((report) => report.created),
    updated: sum((report) => report.updated),
    kept: sum((report) => report.kept),
    photos: sum((report) => report.photos),
    notMatched: [],
    problems: reports.flatMap((report) => report.problems),
  };
}

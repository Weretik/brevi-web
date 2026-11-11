import { flag, integer, list, nullableText, record, text } from '../../validators/content-response';

import type {
  ArticleImportReport,
  OldSiteImportNote,
  OldSiteImportReport,
  SiteCategoryImportReport,
} from '@admin/content/model';

function mapNote(value: unknown): OldSiteImportNote {
  const note = record(value, 'сторінка старого сайту');
  return {
    url: text(note['url'], 'посилання'),
    name: nullableText(note['name'], 'назва'),
    reason: text(note['reason'], 'причина'),
  };
}

export function mapOldSiteImportReport(value: unknown): OldSiteImportReport {
  const report = record(value, 'звіт перенесення');
  return {
    dryRun: flag(report['dryRun'], 'перевірка'),
    total: integer(report['total'], 'усього'),
    created: integer(report['created'], 'створено'),
    updated: integer(report['updated'], 'оновлено'),
    kept: integer(report['kept'], 'залишено'),
    notMatched: list(report['notMatched'], 'без товару').map(mapNote),
    problems: list(report['problems'], 'проблеми').map(mapNote),
  };
}

export function mapSiteCategoryImportReport(value: unknown): SiteCategoryImportReport {
  const report = record(value, 'звіт перенесення розділів');
  return {
    ...mapOldSiteImportReport(value),
    productLinks: integer(report['productLinks'], 'додано товарів'),
  };
}

export function mapArticleImportReport(value: unknown): ArticleImportReport {
  const report = record(value, 'звіт перенесення статей');
  const dryRun = flag(report['dryRun'], 'перевірка');
  return {
    dryRun,
    total: integer(report['total'], 'усього'),
    created: integer(report['created'], 'створено'),
    updated: integer(report['updated'], 'оновлено'),
    kept: integer(report['kept'], 'залишено'),
    photos: dryRun
      ? integer(report['photosToDownload'], 'фото до перенесення')
      : integer(report['photosDownloaded'], 'перенесено фото'),
    notMatched: [],
    problems: list(report['problems'], 'проблеми').map(mapNote),
  };
}

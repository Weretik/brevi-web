import { oldSiteImportMaxItems } from '../../entities/product-pages/old-site-import';

import type { OldSiteImportItems } from '../../entities/product-pages/old-site-import';

export type OldSiteImportFile =
  { ok: true; items: OldSiteImportItems } | { ok: false; message: string };

const isPage = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof (value as Record<string, unknown>)['url'] === 'string';

/** Reads the transfer file: `{ items: [...] }` or the list itself; every page needs its old-site link. */
export function readOldSiteImportFile(content: string): OldSiteImportFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, message: 'Файл не є JSON. Потрібен файл перенесення зі старого сайту.' };
  }
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)['items']
      : null;
  if (!Array.isArray(items) || items.length === 0)
    return { ok: false, message: 'У файлі немає сторінок старого сайту.' };
  if (items.length > oldSiteImportMaxItems)
    return {
      ok: false,
      message: `У файлі ${items.length} сторінок, а за один раз можна перенести до ${oldSiteImportMaxItems}.`,
    };
  if (!items.every(isPage))
    return { ok: false, message: 'У файлі є сторінка без посилання старого сайту.' };
  return { ok: true, items };
}

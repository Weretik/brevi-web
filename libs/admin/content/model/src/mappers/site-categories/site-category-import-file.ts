import { siteCategoryImportMaxItems } from '../../entities/site-categories/site-category-import';

import type { OldSiteImportItems } from '../../entities/product-pages/old-site-import';

export type SiteCategoryImportFile =
  { ok: true; items: OldSiteImportItems } | { ok: false; message: string };

const isCategory = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof (value as Record<string, unknown>)['slug'] === 'string';

/** Reads the category transfer file: `{ items: [...] }` or the list itself; every category needs its address. */
export function readSiteCategoryImportFile(content: string): SiteCategoryImportFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, message: 'Файл не є JSON. Потрібен файл перенесення розділів.' };
  }
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)['items']
      : null;
  if (!Array.isArray(items) || items.length === 0)
    return { ok: false, message: 'У файлі немає розділів старого сайту.' };
  if (items.length > siteCategoryImportMaxItems)
    return {
      ok: false,
      message: `У файлі ${items.length} розділів, а за один раз можна перенести до ${siteCategoryImportMaxItems}.`,
    };
  if (!items.every(isCategory))
    return {
      ok: false,
      message: 'У файлі є розділ без адреси. Схоже, це файл перенесення товарів, а не розділів.',
    };
  return { ok: true, items };
}

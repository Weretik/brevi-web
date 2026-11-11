import { redirectImportMaxItems } from '../../entities/redirects/site-redirect';

import type { OldSiteImportFile } from '../product-pages/old-site-import-file';

const isAddress = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item['from'] === 'string' &&
    item['from'].trim() !== '' &&
    (item['to'] === undefined || item['to'] === null || typeof item['to'] === 'string')
  );
};

/** Reads the address file: `{ items: [{ from, to? }] }` or the list itself. */
export function readRedirectImportFile(content: string): OldSiteImportFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, message: 'Файл не є JSON. Потрібен файл адрес старого сайту.' };
  }
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)['items']
      : null;
  if (!Array.isArray(items) || items.length === 0)
    return { ok: false, message: 'У файлі немає адрес старого сайту.' };
  if (items.length > redirectImportMaxItems)
    return {
      ok: false,
      message: `У файлі ${items.length} адрес, а за один раз можна перенести до ${redirectImportMaxItems}.`,
    };
  if (!items.every(isAddress))
    return { ok: false, message: 'У файлі є рядок без старої адреси («from»).' };
  return { ok: true, items };
}

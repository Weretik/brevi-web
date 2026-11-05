import type { EmbroideryArchiveFile, EmbroideryArchiveRow } from '../entities/embroidery-archive';

export const embroideryArchiveMaxRows = 2000;

const wrongFile = 'Це не файл перенесення архіву вишивки (embroidery-archive.json).';

const isRow = (value: unknown): value is EmbroideryArchiveRow =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  typeof (value as { legacyId?: unknown }).legacyId === 'string' &&
  (value as { legacyId: string }).legacyId.trim() !== '';

/** Reads the transfer file: a JSON list of old calculations, each with its old id. */
export function parseEmbroideryArchiveFile(text: string): EmbroideryArchiveFile {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { rows: [], error: wrongFile };
  }
  if (!Array.isArray(value) || !value.every(isRow)) return { rows: [], error: wrongFile };
  if (value.length === 0) return { rows: [], error: 'У файлі немає розрахунків.' };
  if (value.length > embroideryArchiveMaxRows)
    return { rows: [], error: `У файлі більше ${embroideryArchiveMaxRows} розрахунків.` };
  return { rows: value, error: null };
}

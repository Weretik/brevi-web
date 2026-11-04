import { fabricNormFields } from '../entities/fabric-norm';

import type { FabricNormImportRow, WorkshopStaffImportRow } from '../entities/production-import';

/** Rows of a transfer file, or the reason it cannot be read. */
export type ImportFileResult<Row> = { rows: Row[]; error: null } | { rows: []; error: string };

const fail = (error: string) => ({ rows: [] as [], error });

function readArray(text: string): unknown[] | string {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return 'Файл не схожий на JSON.';
  }
  if (!Array.isArray(value) || value.length === 0) return 'У файлі немає рядків.';
  return value;
}

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

/** `[{ "fullName": "…", "position": "…" }]`, as in workshop-staff.json. */
export function parseStaffImportFile(text: string): ImportFileResult<WorkshopStaffImportRow> {
  const items = readArray(text);
  if (typeof items === 'string') return fail(items);
  const rows: WorkshopStaffImportRow[] = [];
  for (const [index, item] of items.entries()) {
    const row = (item ?? {}) as Record<string, unknown>;
    if (!isText(row['fullName']) || !isText(row['position']))
      return fail(`Рядок ${index + 1}: потрібні fullName і position.`);
    rows.push({ fullName: row['fullName'], position: row['position'] });
  }
  return { rows, error: null };
}

/** `[{ "modelCode": "MOD-025", "norm": { "oneColor": 3.6, … } }]`, as in fabric-norms.json (metres). */
export function parseFabricNormImportFile(text: string): ImportFileResult<FabricNormImportRow> {
  const items = readArray(text);
  if (typeof items === 'string') return fail(items);
  const rows: FabricNormImportRow[] = [];
  for (const [index, item] of items.entries()) {
    const row = (item ?? {}) as Record<string, unknown>;
    const norm = (row['norm'] ?? null) as Record<string, unknown> | null;
    if (!isText(row['modelCode']) || !norm || typeof norm !== 'object')
      return fail(`Рядок ${index + 1}: потрібні modelCode і norm.`);
    const values = Object.fromEntries(
      fabricNormFields.map((field) => [field, norm[field] ?? null]),
    ) as Record<string, unknown>;
    if (Object.values(values).some((value) => value !== null && typeof value !== 'number'))
      return fail(`Рядок ${index + 1}: норма має бути числом у метрах.`);
    rows.push({
      modelCode: row['modelCode'],
      norm: values as unknown as FabricNormImportRow['norm'],
    });
  }
  return { rows, error: null };
}

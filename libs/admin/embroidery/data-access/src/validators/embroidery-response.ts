import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const invalid = () => new Error('Некоректна відповідь сервера розрахунку вишивки.');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);

function check(value: unknown, arrays: readonly string[], numbers: readonly string[]) {
  if (!isRecord(value)) throw invalid();
  if (arrays.some((key) => !Array.isArray(value[key]))) throw invalid();
  if (numbers.some((key) => !isNumber(value[key]))) throw invalid();
}

/** The shape checks the page relies on before mapping; the generated types do not check at run time. */
export function ensureEmbroideryForm(value: unknown): Schemas['CrmEmbroideryForm'] {
  check(value, ['hoops', 'expenses', 'markupNames'], []);
  return value as Schemas['CrmEmbroideryForm'];
}

export function ensureEmbroideryCalculation(value: unknown): Schemas['CrmEmbroideryCalculation'] {
  check(
    value,
    ['missing', 'prices'],
    ['hoopings', 'fullHoopings', 'lastHoopUnits', 'freeInLastHoop'],
  );
  const prices = (value as { prices: unknown[] }).prices;
  if (
    prices.some(
      (price) => !isRecord(price) || !isNumber(price['unit']) || !isNumber(price['total']),
    )
  )
    throw invalid();
  return value as Schemas['CrmEmbroideryCalculation'];
}

export function ensureEmbroiderySettings(value: unknown): Schemas['CrmEmbroiderySettings'] {
  check(value, ['markups', 'hoops', 'expenses'], ['version', 'fabricIncreasePercent']);
  const settings = value as Record<string, unknown>;
  if (
    !isRecord(settings['rates']) ||
    !isRecord(settings['stabilizer']) ||
    !isRecord(settings['fabric'])
  )
    throw invalid();
  return value as Schemas['CrmEmbroiderySettings'];
}

export function ensureEmbroiderySavedPage(value: unknown): Schemas['CrmEmbroiderySavedPage'] {
  check(value, ['items'], ['page', 'pageSize', 'total']);
  const items = (value as { items: unknown[] }).items;
  if (
    items.some((item) => !isRecord(item) || !isNumber(item['id']) || !Array.isArray(item['prices']))
  )
    throw invalid();
  return value as Schemas['CrmEmbroiderySavedPage'];
}

export function ensureEmbroiderySavedCalculation(
  value: unknown,
): Schemas['CrmEmbroiderySavedCalculation'] {
  if (!isRecord(value) || !isRecord(value['summary']) || !isRecord(value['input'])) throw invalid();
  ensureEmbroideryCalculation(value['result']);
  return value as Schemas['CrmEmbroiderySavedCalculation'];
}

export function ensureEmbroideryArchiveResult(
  value: unknown,
): Schemas['CrmEmbroideryArchiveImportResult'] {
  check(value, ['lines'], ['created', 'unchanged', 'errors']);
  const lines = (value as { lines: unknown[] }).lines;
  if (lines.some((line) => !isRecord(line) || typeof line['action'] !== 'string')) throw invalid();
  return value as Schemas['CrmEmbroideryArchiveImportResult'];
}

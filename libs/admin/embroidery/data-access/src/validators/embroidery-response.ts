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

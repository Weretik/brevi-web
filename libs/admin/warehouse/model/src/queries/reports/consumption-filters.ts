import type { FabricConsumptionRow } from '../../entities/consumption/fabric-consumption';

const squash = (value: string) => value.normalize('NFC').toLocaleLowerCase('uk-UA').trim();

export const consumptionSortKeys = [
  'name',
  'received',
  'issuedToTasks',
  'oneOff',
  'corrected',
] as const;
export type ConsumptionSortKey = (typeof consumptionSortKeys)[number];

/** «Витрата за період» rows found by fabric, code or colour and sorted by a column. */
export function filterConsumption(
  rows: readonly FabricConsumptionRow[],
  search: string,
  key: ConsumptionSortKey,
  descending: boolean,
): FabricConsumptionRow[] {
  const term = squash(search);
  const sign = descending ? -1 : 1;
  return rows
    .filter(
      (row) =>
        !term || [row.fabricCode, row.fabricName, row.color].some((x) => squash(x).includes(term)),
    )
    .sort((a, b) =>
      key === 'name'
        ? (a.fabricName.localeCompare(b.fabricName, 'uk') || a.color.localeCompare(b.color, 'uk')) *
          sign
        : (a[key] - b[key]) * sign,
    );
}

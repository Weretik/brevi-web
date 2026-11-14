import type { FabricNormRow } from '../../entities/norms/fabric-norm';

/** null = all models. */
export type FabricNormFilter = 'withNorm' | 'withoutNorm' | 'problems' | null;

const matches = (row: FabricNormRow, filter: FabricNormFilter) =>
  filter === null ||
  (filter === 'withNorm' && row.norm !== null && row.problem === null) ||
  (filter === 'withoutNorm' && row.norm === null) ||
  (filter === 'problems' && row.problem !== null);

export function filterFabricNorms(
  rows: readonly FabricNormRow[],
  search: string,
  filter: FabricNormFilter,
): FabricNormRow[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return rows.filter(
    (row) =>
      matches(row, filter) &&
      (!query || `${row.modelCode} ${row.modelName ?? ''}`.toLocaleLowerCase('uk').includes(query)),
  );
}

export function countFabricNorms(rows: readonly FabricNormRow[]) {
  return {
    withNorm: rows.filter((row) => matches(row, 'withNorm')).length,
    withoutNorm: rows.filter((row) => matches(row, 'withoutNorm')).length,
    problems: rows.filter((row) => matches(row, 'problems')).length,
  };
}

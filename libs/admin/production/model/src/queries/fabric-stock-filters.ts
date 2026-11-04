import type { FabricStockRow } from '../entities/fabric-stock';

/** Chips over the stock list; null shows every line. */
export type FabricStockFilter = 'short' | 'negative' | 'reserved' | null;

const matches: Record<Exclude<FabricStockFilter, null>, (row: FabricStockRow) => boolean> = {
  short: (row) => row.available < 0,
  negative: (row) => row.meters < 0,
  reserved: (row) => row.reserved > 0,
};

export function countFabricStock(rows: readonly FabricStockRow[]) {
  return {
    short: rows.filter(matches.short).length,
    negative: rows.filter(matches.negative).length,
    reserved: rows.filter(matches.reserved).length,
  };
}

/** Search by code, fabric or colour, then the chip. */
export function filterFabricStock(
  rows: readonly FabricStockRow[],
  search: string,
  filter: FabricStockFilter,
): FabricStockRow[] {
  const query = search.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (!query ||
        row.fabricCode.toLowerCase().includes(query) ||
        row.fabricName.toLowerCase().includes(query) ||
        row.color.toLowerCase().includes(query)) &&
      (filter === null || matches[filter](row)),
  );
}

/**
 * The problem of a line, or null: the balance below zero, or open orders need more than lies on
 * the shelf. Lines without a problem carry no mark.
 */
export function fabricStockProblem(row: FabricStockRow): string | null {
  if (row.meters < 0) return 'Мінус: перевірте прихід';
  if (row.available < 0) return `Не вистачає ${formatPlain(-row.available)} м`;
  return null;
}

const plain = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const formatPlain = (value: number) => plain.format(value);

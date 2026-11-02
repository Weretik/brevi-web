/** Supplier filter of a reference list: `null` shows every supplier; `''` rows without one. */
export type ReferenceSupplierFilter = string | null;

export interface ReferenceSupplierOption {
  /** Supplier name as stored on the row; `''` for rows without a supplier. */
  value: string;
  count: number;
}

/** Suppliers present in the loaded list with their row counts, by name; «no supplier» last. */
export function listReferenceSuppliers<Row>(
  rows: readonly Row[],
  supplierOf: (row: Row) => string | null | undefined,
): ReferenceSupplierOption[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = supplierOf(row)?.trim() ?? '';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) =>
      !a.value ? 1 : !b.value ? -1 : a.value.localeCompare(b.value, 'uk', { sensitivity: 'base' }),
    );
}

export function matchesReferenceSupplier(
  supplier: string | null | undefined,
  filter: ReferenceSupplierFilter,
): boolean {
  return filter === null || (supplier?.trim() ?? '') === filter;
}

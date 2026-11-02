export type ReferenceActivityFilter = 'active' | 'inactive' | 'all';

export type ReferenceActivityCounts = Record<ReferenceActivityFilter, number>;

interface ActivityRow {
  isActive: boolean;
}

export function countByActivity(rows: readonly ActivityRow[]): ReferenceActivityCounts {
  const active = rows.filter((row) => row.isActive).length;
  return { active, inactive: rows.length - active, all: rows.length };
}

/** Local search over the loaded list: activity first, then any of the given text values. */
export function filterReferenceRows<Row extends ActivityRow>(
  rows: Row[],
  search: string,
  activity: ReferenceActivityFilter,
  searchValues: (row: Row) => (string | null | undefined)[],
): Row[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return rows.filter(
    (row) =>
      (activity === 'all' || row.isActive === (activity === 'active')) &&
      (!query || searchValues(row).some((value) => value?.toLocaleLowerCase('uk').includes(query))),
  );
}

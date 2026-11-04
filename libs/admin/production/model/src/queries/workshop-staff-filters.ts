import type { WorkshopEmployee } from '../entities/workshop-employee';

export type WorkshopStaffStatus = 'active' | 'archived';

export function filterWorkshopStaff(
  rows: readonly WorkshopEmployee[],
  search: string,
  status: WorkshopStaffStatus,
  position: string | null,
): WorkshopEmployee[] {
  const query = search.trim().toLocaleLowerCase('uk');
  return rows.filter(
    (row) =>
      row.isActive === (status === 'active') &&
      (position === null || row.position === position) &&
      (!query || `${row.fullName} ${row.position}`.toLocaleLowerCase('uk').includes(query)),
  );
}

/** Positions of the rows in the chosen status with their counts, most common first. */
export function countWorkshopPositions(
  rows: readonly WorkshopEmployee[],
  status: WorkshopStaffStatus,
) {
  const counts = new Map<string, number>();
  for (const row of rows)
    if (row.isActive === (status === 'active'))
      counts.set(row.position, (counts.get(row.position) ?? 0) + 1);
  return [...counts.entries()]
    .map(([position, count]) => ({ position, count }))
    .sort((a, b) => b.count - a.count || a.position.localeCompare(b.position, 'uk'));
}

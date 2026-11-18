import { countWorkshopPositions } from '@admin/production/model';
import { WorkshopStaffChips } from '@admin/production/ui';
import { ReferenceFilterRow, ReferenceSearchBar } from '@admin/references/ui';

import type { useWorkshopStaffPage } from '../../hooks/staff/use-workshop-staff-page';

interface Props {
  page: ReturnType<typeof useWorkshopStaffPage>;
}

/** Search, the status and position chips and the count of the staff list. */
export function WorkshopStaffFilters({ page }: Props) {
  const {
    rows,
    search,
    setSearch,
    status,
    setStatus,
    position,
    setPosition,
    filtered,
    inStatus,
    activeCount,
  } = page;
  return (
    <>
      <ReferenceSearchBar
        placeholder="Знайти за ПІБ або посадою"
        label="Пошук працівників"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <WorkshopStaffChips
            status={status}
            activeCount={activeCount}
            archivedCount={rows.length - activeCount}
            positions={countWorkshopPositions(rows, status)}
            position={position}
            onStatusChange={(next) => {
              setStatus(next);
              setPosition(null);
            }}
            onPositionChange={setPosition}
          />
        }
        count={filtered.length}
        total={inStatus}
        countLabel="Кількість працівників"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
    </>
  );
}

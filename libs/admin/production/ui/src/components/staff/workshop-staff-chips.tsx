import { ReferenceFilterChip } from '@admin/references/ui';

import type { WorkshopStaffStatus } from '@admin/production/model';

interface Props {
  status: WorkshopStaffStatus;
  activeCount: number;
  archivedCount: number;
  positions: { position: string; count: number }[];
  position: string | null;
  onStatusChange: (status: WorkshopStaffStatus) => void;
  onPositionChange: (position: string | null) => void;
}

/** «Працюють» / «Архів», then the positions of the chosen list with counts. */
export function WorkshopStaffChips({
  status,
  activeCount,
  archivedCount,
  positions,
  position,
  onStatusChange,
  onPositionChange,
}: Props) {
  return (
    <>
      <ReferenceFilterChip
        label="Працюють"
        count={activeCount}
        selected={status === 'active'}
        onClick={() => onStatusChange('active')}
      />
      <ReferenceFilterChip
        label="Архів"
        count={archivedCount}
        selected={status === 'archived'}
        onClick={() => onStatusChange('archived')}
      />
      {positions.length > 1 &&
        positions.map((item) => (
          <ReferenceFilterChip
            key={item.position}
            label={item.position}
            count={item.count}
            selected={position === item.position}
            onClick={() => onPositionChange(position === item.position ? null : item.position)}
          />
        ))}
    </>
  );
}

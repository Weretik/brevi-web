import { ReferenceFilterChip } from '@admin/references/ui';

import type { ProductionOrderCounts, ProductionOrderStatus } from '@admin/production/model';

interface Props {
  counts: ProductionOrderCounts;
  status: ProductionOrderStatus | null;
  overdue: boolean;
  onStatusChange: (status: ProductionOrderStatus | null) => void;
  onOverdueChange: (overdue: boolean) => void;
}

/** «Усі», «Нові», «Закриті», «Скасовані» with counts, then «Прострочені». */
export function ProductionOrderChips({
  counts,
  status,
  overdue,
  onStatusChange,
  onOverdueChange,
}: Props) {
  const chips: { label: string; value: ProductionOrderStatus | null; count: number }[] = [
    { label: 'Усі', value: null, count: counts.all },
    { label: 'Нові', value: 'New', count: counts.new },
    { label: 'Закриті', value: 'Closed', count: counts.closed },
    { label: 'Скасовані', value: 'Cancelled', count: counts.cancelled },
  ];
  return (
    <>
      {chips
        .filter((chip) => chip.value === null || chip.count > 0 || status === chip.value)
        .map((chip) => (
          <ReferenceFilterChip
            key={chip.label}
            label={chip.label}
            count={chip.count}
            selected={status === chip.value}
            onClick={() => onStatusChange(chip.value)}
          />
        ))}
      <ReferenceFilterChip
        label="Прострочені"
        selected={overdue}
        onClick={() => onOverdueChange(!overdue)}
      />
    </>
  );
}

import { ReferenceFilterChip } from '@admin/references/ui';

import type { ProductionOrderCounts, ProductionOrderStatus } from '@admin/production/model';

interface Props {
  counts: ProductionOrderCounts;
  /** Undefined when «Прострочені» or «Термін горить» narrows the list instead of a status. */
  status: ProductionOrderStatus | null | undefined;
  overdue: boolean;
  /** «Нове» orders due before today; the chip shows only when there are some or it is on. */
  overdueCount: number;
  onStatusChange: (status: ProductionOrderStatus | null) => void;
  onOverdueChange: (overdue: boolean) => void;
}

/** «Нові», «Прострочені», «Закриті», «Скасовані», «Усі» with counts; an empty status hides unless it is chosen. */
export function ProductionOrderChips({
  counts,
  status,
  overdue,
  overdueCount,
  onStatusChange,
  onOverdueChange,
}: Props) {
  const chips: { label: string; value: ProductionOrderStatus | null; count: number }[] = [
    { label: 'Нові', value: 'New', count: counts.new },
    { label: 'Закриті', value: 'Closed', count: counts.closed },
    { label: 'Скасовані', value: 'Cancelled', count: counts.cancelled },
    { label: 'Усі', value: null, count: counts.all },
  ];
  const visible = chips.filter(
    (chip) =>
      chip.value === null || chip.value === 'New' || chip.count > 0 || status === chip.value,
  );
  return (
    <>
      {visible.slice(0, 1).map((chip) => (
        <ReferenceFilterChip
          key={chip.label}
          label={chip.label}
          count={chip.count}
          selected={status === chip.value}
          onClick={() => onStatusChange(chip.value)}
        />
      ))}
      {(overdueCount > 0 || overdue) && (
        <ReferenceFilterChip
          label="Прострочені"
          count={overdueCount}
          selected={overdue}
          onClick={() => onOverdueChange(!overdue)}
        />
      )}
      {visible.slice(1).map((chip) => (
        <ReferenceFilterChip
          key={chip.label}
          label={chip.label}
          count={chip.count}
          selected={status === chip.value}
          onClick={() => onStatusChange(chip.value)}
        />
      ))}
    </>
  );
}

import { ReferenceFilterChip } from '@admin/references/ui';

import type { FabricStockFilter } from '@admin/production/model';

interface Props {
  total: number;
  counts: { short: number; negative: number; reserved: number };
  value: FabricStockFilter;
  onChange: (value: FabricStockFilter) => void;
}

/** All · reserved · problems (not enough, below zero) only when there are some. */
export function FabricStockChips({ total, counts, value, onChange }: Props) {
  return (
    <>
      <ReferenceFilterChip
        label="Усі"
        count={total}
        selected={value === null}
        onClick={() => onChange(null)}
      />
      <ReferenceFilterChip
        label="Під замовлення"
        count={counts.reserved}
        selected={value === 'reserved'}
        onClick={() => onChange('reserved')}
      />
      {counts.short > 0 && (
        <ReferenceFilterChip
          label="Не вистачає"
          count={counts.short}
          selected={value === 'short'}
          onClick={() => onChange('short')}
        />
      )}
      {counts.negative > 0 && (
        <ReferenceFilterChip
          label="Мінус"
          count={counts.negative}
          selected={value === 'negative'}
          onClick={() => onChange('negative')}
        />
      )}
    </>
  );
}

import { ReferenceFilterChip } from '@admin/references/ui';

import type { FabricNormFilter } from '@admin/production/model';

interface Props {
  total: number;
  counts: { withNorm: number; withoutNorm: number; problems: number };
  value: FabricNormFilter;
  onChange: (value: FabricNormFilter) => void;
}

/** All · with a norm · without · problems (only when there are some). */
export function FabricNormFilterChips({ total, counts, value, onChange }: Props) {
  return (
    <>
      <ReferenceFilterChip
        label="Усі"
        count={total}
        selected={value === null}
        onClick={() => onChange(null)}
      />
      <ReferenceFilterChip
        label="З нормою"
        count={counts.withNorm}
        selected={value === 'withNorm'}
        onClick={() => onChange('withNorm')}
      />
      <ReferenceFilterChip
        label="Без норми"
        count={counts.withoutNorm}
        selected={value === 'withoutNorm'}
        onClick={() => onChange('withoutNorm')}
      />
      {counts.problems > 0 && (
        <ReferenceFilterChip
          label="Проблеми"
          count={counts.problems}
          selected={value === 'problems'}
          onClick={() => onChange('problems')}
        />
      )}
    </>
  );
}

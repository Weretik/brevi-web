import { productSectionTypeLabels } from '@admin/references/model';
import { Stack } from '@mui/material';

import { ReferenceFilterChip } from '../reference-list-controls/reference-filter-chip';

import type { ProductSectionTypeCount, ProductSectionTypeFilter } from '@admin/references/model';

interface Props {
  counts: ProductSectionTypeCount[];
  total: number;
  value: ProductSectionTypeFilter;
  onChange: (value: ProductSectionTypeFilter) => void;
}

/** «Усі», «Швейна продукція» and «ЗІЗ» with counts. */
export function ProductSectionTypeChips({ counts, total, value, onChange }: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Фільтр за типом товару"
      sx={{ gap: 1, flexWrap: 'wrap' }}
    >
      <ReferenceFilterChip
        label="Усі"
        count={total}
        selected={value === null}
        onClick={() => onChange(null)}
      />
      {counts.map(({ type, count }) => (
        <ReferenceFilterChip
          key={type}
          label={productSectionTypeLabels[type]}
          count={count}
          selected={value === type}
          onClick={() => onChange(type)}
        />
      ))}
    </Stack>
  );
}

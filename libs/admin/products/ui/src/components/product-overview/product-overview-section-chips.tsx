import { ReferenceFilterChip } from '@admin/references/ui';
import { Stack } from '@mui/material';

import type { ProductSectionCount, ProductSectionFilter } from '@admin/products/model';

interface Props {
  counts: ProductSectionCount[];
  sectionNames: ReadonlyMap<number, string>;
  total: number;
  value: ProductSectionFilter;
  onChange: (value: ProductSectionFilter) => void;
  /** «Без ціни» (CAT-011): combines with the section chip. */
  withoutPrice?: { count: number; selected: boolean; onToggle: () => void };
  /** «Активні» / «Вимкнені» (CAT-018): a second click on the chosen chip shows both again. */
  activity?: { value: boolean | null; inactive: number; onChange: (value: boolean | null) => void };
}

/** «Усі», one chip per section in use, «Без розділу», «Активні»/«Вимкнені» and «Без ціни», with counts. */
export function ProductOverviewSectionChips({
  counts,
  sectionNames,
  total,
  value,
  onChange,
  withoutPrice,
  activity,
}: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Фільтр за розділом"
      sx={{ gap: 1, flexWrap: 'wrap' }}
    >
      <ReferenceFilterChip
        label="Усі"
        count={total}
        selected={value === null}
        onClick={() => onChange(null)}
      />
      {counts.map(({ sectionId, count }) => {
        const filter: ProductSectionFilter = sectionId ?? 'none';
        return (
          <ReferenceFilterChip
            key={String(filter)}
            label={
              sectionId === null
                ? 'Без розділу'
                : (sectionNames.get(sectionId) ?? `Розділ ${sectionId}`)
            }
            count={count}
            selected={value === filter}
            onClick={() => onChange(filter)}
          />
        );
      })}
      {activity && (
        <>
          <ReferenceFilterChip
            label="Активні"
            count={Math.max(total - activity.inactive, 0)}
            selected={activity.value === true}
            onClick={() => activity.onChange(activity.value === true ? null : true)}
          />
          <ReferenceFilterChip
            label="Вимкнені"
            count={activity.inactive}
            selected={activity.value === false}
            onClick={() => activity.onChange(activity.value === false ? null : false)}
          />
        </>
      )}
      {withoutPrice && withoutPrice.count > 0 && (
        <ReferenceFilterChip
          label="Без ціни"
          count={withoutPrice.count}
          selected={withoutPrice.selected}
          onClick={withoutPrice.onToggle}
        />
      )}
    </Stack>
  );
}

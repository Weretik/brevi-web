import { Stack } from '@mui/material';

import { ReferenceFilterChip } from '../reference-list-controls/reference-filter-chip';

import type {
  PricingParameterSection,
  PricingParameterSectionFilter,
} from '@admin/references/model';

interface Props {
  sections: PricingParameterSection[];
  total: number;
  value: PricingParameterSectionFilter;
  onChange: (value: PricingParameterSectionFilter) => void;
}

/** «Усі» and one chip per sheet section («Оплата праці», «Прибуток — ЗІЗ»…), with counts. */
export function PricingSectionChips({ sections, total, value, onChange }: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Фільтр за групою"
      sx={{ gap: 1, flexWrap: 'wrap' }}
    >
      <ReferenceFilterChip
        label="Усі"
        count={total}
        selected={value === null}
        onClick={() => onChange(null)}
      />
      {sections.map((section) => (
        <ReferenceFilterChip
          key={section.value}
          label={section.value}
          count={section.count}
          selected={value === section.value}
          onClick={() => onChange(section.value)}
        />
      ))}
    </Stack>
  );
}

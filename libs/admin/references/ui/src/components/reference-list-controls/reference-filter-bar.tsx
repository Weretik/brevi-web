import { Box, Stack } from '@mui/material';

import { ReferenceFilterChip } from './reference-filter-chip';
import { ReferenceFilterRow } from './reference-filter-row';

import type { ReferenceActivityCounts, ReferenceActivityFilter } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  activity: ReferenceActivityFilter;
  activityCounts: ReferenceActivityCounts;
  onActivityChange: (value: ReferenceActivityFilter) => void;
  /** Extra filters after the divider, e.g. the supplier chip. */
  extraFilters?: ReactNode;
  /** Rows left after search and extra filters, and rows of the current activity tab. */
  count: number;
  total: number;
  /** Accessible name of the result counter, e.g. «Кількість тканин». */
  countLabel: string;
  selectedCount: number;
  onClearSelection: () => void;
}

const activityOptions: { value: ReferenceActivityFilter; label: string }[] = [
  { value: 'active', label: 'Активні' },
  { value: 'inactive', label: 'Не використовуються' },
  { value: 'all', label: 'Усі' },
];

/** The filter row of lists with an active flag: activity chips with counts, then extra filters. */
export function ReferenceFilterBar({
  activity,
  activityCounts,
  onActivityChange,
  extraFilters,
  ...row
}: Props) {
  return (
    <ReferenceFilterRow
      {...row}
      filters={
        <>
          <Stack direction="row" role="group" aria-label="Фільтр за активністю" sx={{ gap: 1 }}>
            {activityOptions.map((option) => (
              <ReferenceFilterChip
                key={option.value}
                label={option.label}
                count={activityCounts[option.value]}
                selected={activity === option.value}
                onClick={() => onActivityChange(option.value)}
              />
            ))}
          </Stack>
          {extraFilters && (
            <>
              <Box aria-hidden sx={{ width: '1px', height: 20, bgcolor: 'divider', mx: 0.5 }} />
              {extraFilters}
            </>
          )}
        </>
      }
    />
  );
}

import { Box, Link, Stack, Typography } from '@mui/material';

import { ReferenceFilterChip } from './reference-filter-chip';

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

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * «Цех» filter row between the search bar and the table: activity chips with counts, extra
 * filters, and on the right the selection («Вибрано 2 · Зняти вибір») or the number found.
 */
export function ReferenceFilterBar({
  activity,
  activityCounts,
  onActivityChange,
  extraFilters,
  count,
  total,
  countLabel,
  selectedCount,
  onClearSelection,
}: Props) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, mb: 1.5, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
    >
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
      </Stack>
      <Typography variant="body2" color="text.secondary" role="status" aria-label={countLabel}>
        {selectedCount > 0 ? (
          <>
            Вибрано:{' '}
            <Box component="span" sx={mono}>
              {selectedCount}
            </Box>{' '}
            ·{' '}
            <Link component="button" type="button" variant="body2" onClick={onClearSelection}>
              Зняти вибір
            </Link>
          </>
        ) : count !== total ? (
          <>
            Знайдено:{' '}
            <Box component="span" sx={mono}>
              {count}
            </Box>{' '}
            із{' '}
            <Box component="span" sx={mono}>
              {total}
            </Box>
          </>
        ) : null}
      </Typography>
    </Stack>
  );
}

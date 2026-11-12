import { ReferenceFilterChip, ReferenceSearchBar } from '@admin/references/ui';
import {
  fabricMovementChips,
  formatDay,
  movementPeriodLabels,
  movementPeriods,
} from '@admin/warehouse/model';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Box, Menu, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type {
  FabricMovementCounts,
  FabricMovementQuery,
  MovementPeriod,
} from '@admin/warehouse/model';

interface Props {
  query: FabricMovementQuery;
  /** What is typed in the search, before it reaches the query. */
  search: string;
  /** Movements of each chip under the other filters; null while the server gives none. */
  counts: FabricMovementCounts | null;
  period: MovementPeriod;
  onSearch: (value: string) => void;
  onChange: (change: Partial<Omit<FabricMovementQuery, 'page'>>) => void;
  onPeriod: (period: MovementPeriod) => void;
}

const periodLabel = (period: MovementPeriod, query: FabricMovementQuery) => {
  if (period !== 'custom' || (!query.from && !query.to)) return movementPeriodLabels[period];
  return `${query.from ? formatDay(query.from) : '…'} – ${query.to ? formatDay(query.to) : '…'}`;
};

/**
 * «Рух тканини» filters: one search over every text of a movement, the kind chips with their counts and the period
 * chip; «Свій період» shows the two dates.
 */
export function FabricMovementFilters({
  query,
  search,
  counts,
  period,
  onSearch,
  onChange,
  onPeriod,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <Box sx={{ mb: 2 }}>
      <ReferenceSearchBar
        placeholder="Тканина, колір, постачальник, документ або Ц-12"
        label="Пошук руху тканини"
        value={search}
        onChange={onSearch}
      />
      <Stack
        direction="row"
        role="group"
        aria-label="Вид руху"
        sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}
      >
        {fabricMovementChips.map(([kind, label]) => (
          <ReferenceFilterChip
            key={kind}
            label={label}
            count={counts?.[kind]}
            selected={query.kind === kind}
            onClick={() => onChange({ kind })}
          />
        ))}
        <Box sx={{ flex: 1 }} />
        <ReferenceFilterChip
          label={periodLabel(period, query)}
          selected={period !== 'all'}
          ariaHasPopup
          icon={<ExpandMoreOutlinedIcon fontSize="small" />}
          onClick={(event) => setAnchor(event.currentTarget)}
        />
        <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
          {movementPeriods.map((value) => (
            <MenuItem
              key={value}
              selected={value === period}
              onClick={() => {
                setAnchor(null);
                onPeriod(value);
              }}
            >
              {movementPeriodLabels[value]}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      {period === 'custom' && (
        <Stack direction="row" sx={{ gap: 1.5, mt: 1.5, justifyContent: 'flex-end' }}>
          <TextField
            type="date"
            size="small"
            label="Від"
            value={query.from ?? ''}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: query.to ?? undefined } }}
            onChange={(event) => onChange({ from: event.target.value || null })}
          />
          <TextField
            type="date"
            size="small"
            label="До"
            value={query.to ?? ''}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: query.from ?? undefined },
            }}
            onChange={(event) => onChange({ to: event.target.value || null })}
          />
        </Stack>
      )}
    </Box>
  );
}

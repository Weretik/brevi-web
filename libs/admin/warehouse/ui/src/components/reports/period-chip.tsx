import { ReferenceFilterChip } from '@admin/references/ui';
import { formatDay, movementPeriodLabels } from '@admin/warehouse/model';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Menu, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import type { MovementPeriod } from '@admin/warehouse/model';

interface Props {
  periods: readonly MovementPeriod[];
  period: MovementPeriod;
  from: string | null;
  to: string | null;
  onPeriod: (period: MovementPeriod) => void;
  onDates: (dates: { from: string | null; to: string | null }) => void;
}

/** The period chip of a report; «Свій період» shows the two dates next to it. */
export function PeriodChip({ periods, period, from, to, onPeriod, onDates }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const label =
    period === 'custom' && (from || to)
      ? `${from ? formatDay(from) : '…'} – ${to ? formatDay(to) : '…'}`
      : movementPeriodLabels[period];
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      <ReferenceFilterChip
        label={label}
        selected={period !== 'all'}
        ariaHasPopup
        icon={<ExpandMoreOutlinedIcon fontSize="small" />}
        onClick={(event) => setAnchor(event.currentTarget)}
      />
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        {periods.map((value) => (
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
      {period === 'custom' && (
        <>
          <TextField
            type="date"
            size="small"
            label="Від"
            value={from ?? ''}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: to ?? undefined } }}
            onChange={(event) => onDates({ from: event.target.value || null, to })}
          />
          <TextField
            type="date"
            size="small"
            label="До"
            value={to ?? ''}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: from ?? undefined } }}
            onChange={(event) => onDates({ from, to: event.target.value || null })}
          />
        </>
      )}
    </Stack>
  );
}

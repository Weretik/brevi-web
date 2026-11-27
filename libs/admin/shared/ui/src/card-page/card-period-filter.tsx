import { Chip, Stack, TextField, Typography } from '@mui/material';

import { cardPeriodLabels, cardPeriodRange, cardPeriods } from './card-period';

import type { CardPeriodState } from './card-period';

interface Props {
  value: CardPeriodState;
  onChange: (next: CardPeriodState) => void;
  /** Today, for the presets; tests pass a fixed day. */
  today?: Date;
}

/** One period for every tab of a card: preset chips and, for «Свій період», two dates. */
export function CardPeriodFilter({ value, onChange, today = new Date() }: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Період"
      sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ mr: 0.5 }}>
        Період
      </Typography>
      {cardPeriods.map((period) => (
        <Chip
          key={period}
          label={cardPeriodLabels[period]}
          color={value.period === period ? 'secondary' : 'default'}
          variant={value.period === period ? 'filled' : 'outlined'}
          aria-pressed={value.period === period}
          onClick={() => onChange(cardPeriodRange(period, today, value))}
          sx={{ height: 28, borderRadius: '6px' }}
        />
      ))}
      {value.period === 'custom' && (
        <>
          <TextField
            type="date"
            size="small"
            label="Від"
            value={value.from ?? ''}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: value.to } }}
            onChange={(event) => onChange({ ...value, from: event.target.value || undefined })}
          />
          <TextField
            type="date"
            size="small"
            label="До"
            value={value.to ?? ''}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: value.from } }}
            onChange={(event) => onChange({ ...value, to: event.target.value || undefined })}
          />
        </>
      )}
    </Stack>
  );
}

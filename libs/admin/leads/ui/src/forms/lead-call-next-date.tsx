import { leadQuickDates } from '@admin/leads/model';
import { Box, Chip, Stack, TextField } from '@mui/material';

interface Props {
  /** «Повторити» takes an optional date; other results need one. */
  retry: boolean;
  value: string;
  error?: string;
  disabled: boolean;
  now: Date;
  onChange: (value: string) => void;
}

/** When to call next, with quick dates under the field. */
export function LeadCallNextDate({ retry, value, error, disabled, now, onChange }: Props) {
  return (
    <Box>
      <TextField
        label={retry ? 'Коли повторити (необов’язково)' : 'Коли зв’язатися'}
        type="datetime-local"
        value={value}
        disabled={disabled}
        error={Boolean(error)}
        helperText={error}
        onChange={(event) => onChange(event.target.value)}
        fullWidth
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { style: { fontFamily: 'var(--admin-font-mono)' } },
        }}
      />
      <Stack direction="row" sx={{ gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
        {leadQuickDates(now).map((quick) => (
          <Chip
            key={quick.label}
            size="small"
            label={quick.label}
            variant={value === quick.value ? 'filled' : 'outlined'}
            onClick={() => onChange(quick.value)}
          />
        ))}
      </Stack>
    </Box>
  );
}

import { Button, Paper, Stack, TextField } from '@mui/material';

import type { FinancePeriod } from '@admin/accounting/model';

interface Props {
  value: FinancePeriod;
  onChange: (value: FinancePeriod) => void;
  /** Called with a valid period on «Показати». */
  onApply: (value: FinancePeriod) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** «Свій період…»: two dates and «Показати». */
export function FinancePeriodForm({ value, onChange, onApply }: Props) {
  const problem = value.to < value.from ? 'Кінець періоду раніший за початок.' : null;
  return (
    <Paper
      component="form"
      variant="outlined"
      aria-label="Свій період"
      onSubmit={(event) => {
        event.preventDefault();
        if (!problem) onApply(value);
      }}
      sx={{ p: 2 }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, alignItems: { sm: 'flex-start' } }}
      >
        <TextField
          label="Від"
          type="date"
          size="small"
          value={value.from}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
          error={Boolean(problem)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
        />
        <TextField
          label="До"
          type="date"
          size="small"
          value={value.to}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
          error={Boolean(problem)}
          helperText={problem}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { style: mono } }}
        />
        <Button type="submit" variant="contained" disabled={Boolean(problem)}>
          Показати
        </Button>
      </Stack>
    </Paper>
  );
}

import { InputAdornment, TextField } from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';

interface Props {
  value: string;
  defaultPercent: number;
  error: string | null;
  onChange: (value: string) => void;
}

/** Discount off the supplier price; administrators and the director only. */
export function PriceSourceDiscountForm({ value, defaultPercent, error, onChange }: Props) {
  return (
    <ReferenceFormSection title="Знижка">
      <TextField
        label="Знижка від ціни постачальника"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={Boolean(error)}
        helperText={
          error ?? `Від 0 до 90%. Як у скрипті: ${String(defaultPercent).replace('.', ',')}%.`
        }
        slotProps={{
          input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
          htmlInput: { inputMode: 'decimal' },
        }}
        autoFocus
        required
      />
    </ReferenceFormSection>
  );
}

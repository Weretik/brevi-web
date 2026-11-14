import { Autocomplete, TextField } from '@mui/material';

import type { SxProps, Theme } from '@mui/material';

interface Props {
  id?: string;
  label: string;
  value: string;
  /** Active colours of «Кольори» in list order. */
  colors: readonly string[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
  onChange: (value: string) => void;
}

/**
 * A colour picked only from «Кольори» (BreviERP REF-006). A colour the record already has stays in the list, so
 * an item saved before the list keeps it.
 */
export function ProductionColorField({
  id,
  label,
  value,
  colors,
  required,
  disabled,
  error,
  helperText,
  sx,
  onChange,
}: Props) {
  const options = value && !colors.includes(value) ? [value, ...colors] : [...colors];
  return (
    <Autocomplete
      id={id}
      options={options}
      value={value || null}
      disabled={disabled}
      sx={sx}
      fullWidth
      autoHighlight
      noOptionsText="Немає такого кольору в «Кольори»"
      onChange={(_event, next) => onChange(next ?? '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={Boolean(error)}
          helperText={error ?? helperText}
        />
      )}
    />
  );
}

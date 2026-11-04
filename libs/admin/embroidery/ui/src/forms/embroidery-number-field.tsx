import { InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import type { SxProps, Theme } from '@mui/material';

interface Props {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  /** «шт», «грн», «%», «см». */
  unit?: string;
  error?: string;
  helperText?: string;
  /** Whole numbers only: the keyboard on phones shows no comma. */
  integer?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  autoFocus?: boolean;
  sx?: SxProps<Theme>;
  /** For a field without a visible label, e.g. inside a table row. */
  ariaLabel?: string;
}

const textOf = (value: number | null) => (value === null ? '' : String(value).replace('.', ','));

/** Reads «0,30» and «0.30»; anything that is not a number is null. */
export function parseEmbroideryNumber(text: string): number | null {
  const normalized = text.replace(/\s/g, '').replace(',', '.');
  if (!normalized || !/^-?\d*\.?\d*$/.test(normalized) || normalized === '-' || normalized === '.')
    return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** A number input that keeps what the person types («0,») and reports the number, or null when empty. */
export function EmbroideryNumberField({
  label,
  value,
  onChange,
  unit,
  error,
  helperText,
  integer = false,
  placeholder,
  size = 'medium',
  autoFocus,
  sx,
  ariaLabel,
}: Props) {
  const [text, setText] = useState(() => textOf(value));
  useEffect(() => {
    setText((current) => (parseEmbroideryNumber(current) === value ? current : textOf(value)));
  }, [value]);

  return (
    <TextField
      label={label}
      value={text}
      size={size}
      autoFocus={autoFocus}
      placeholder={placeholder}
      error={Boolean(error)}
      helperText={error ?? helperText}
      onChange={(event) => {
        setText(event.target.value);
        onChange(parseEmbroideryNumber(event.target.value));
      }}
      sx={sx}
      slotProps={{
        htmlInput: {
          inputMode: integer ? 'numeric' : 'decimal',
          'aria-label': ariaLabel,
          style: { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' },
        },
        input: unit
          ? { endAdornment: <InputAdornment position="end">{unit}</InputAdornment> }
          : undefined,
      }}
    />
  );
}

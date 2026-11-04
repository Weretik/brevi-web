import { quoteSettingsShortMax, quoteSettingsTextMax } from '@admin/quotes/model';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useRef } from 'react';

import { QuoteMarkChips } from './quote-mark-chips';
import { useQuoteSettingsForm } from './quote-settings-form-context';

import type { QuoteTemplateMark } from '@admin/quotes/model';

interface Props {
  label: string;
  value: string;
  error?: string | undefined;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  /** Spans the whole grid row. */
  wide?: boolean;
  /** Error path of the field; the preview highlights it while the field has focus. */
  path?: string;
  /** The saved value: when the field differs, it offers «Повернути як було». */
  saved?: string;
  /** Shows the mark buttons under the field. */
  marks?: boolean;
  onChange: (value: string) => void;
}

/** A text field of «Налаштування КП» with mark buttons and a way back to the saved text. */
export function QuoteSettingsField({
  label,
  value,
  error,
  helperText,
  placeholder,
  required,
  multiline,
  wide,
  path,
  saved,
  marks,
  onChange,
}: Props) {
  const { onFocusField } = useQuoteSettingsForm();
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const changed = saved !== undefined && saved !== value;

  const insert = (mark: QuoteTemplateMark) => {
    const element = input.current;
    const start = element?.selectionStart ?? value.length;
    const end = element?.selectionEnd ?? start;
    onChange(value.slice(0, start) + mark + value.slice(end));
    const cursor = start + mark.length;
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <Box sx={{ minWidth: 0, ...(wide && { gridColumn: '1 / -1' }) }}>
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value}
        placeholder={placeholder}
        required={required}
        multiline={multiline}
        minRows={multiline ? 3 : undefined}
        error={Boolean(error)}
        helperText={error ?? helperText}
        inputRef={input}
        onFocus={() => path && onFocusField(path)}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          htmlInput: { maxLength: multiline ? quoteSettingsTextMax : quoteSettingsShortMax },
          inputLabel: placeholder ? { shrink: true } : undefined,
        }}
      />
      {(marks || changed) && (
        <Stack
          direction="row"
          sx={{ mt: 0.75, gap: 1, alignItems: 'flex-start', justifyContent: 'space-between' }}
        >
          {marks ? <QuoteMarkChips fieldLabel={label} onInsert={insert} /> : <span />}
          {changed && (
            <Button
              size="small"
              onClick={() => onChange(saved)}
              aria-label={`Повернути як було: ${label}`}
              sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Повернути як було
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}

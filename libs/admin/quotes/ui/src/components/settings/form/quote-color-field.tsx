import { Box, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';

import { useQuoteSettingsForm } from './quote-settings-form-context';

interface Props {
  label: string;
  value: string;
  error: string | undefined;
  path: string;
  onChange: (value: string) => void;
}

/** Brevi orange, the PDF accent and a few calm colours to pick without typing a code. */
const presets = [
  { color: '#FD9600', name: 'Помаранчевий Brevi' },
  { color: '#E8780F', name: 'Помаранчевий PDF' },
  { color: '#1F1F1F', name: 'Графіт' },
  { color: '#2E7D32', name: 'Зелений' },
  { color: '#175CD3', name: 'Синій' },
];

const swatch = { width: 22, height: 22, borderRadius: 0.75, border: 1, borderColor: 'divider' };

/** A colour: a sample to click, ready colours, or a #RRGGBB code for an exact match. */
export function QuoteColorField({ label, value, error, path, onChange }: Props) {
  const { onFocusField } = useQuoteSettingsForm();
  const valid = /^#[0-9a-fA-F]{6}$/.test(value.trim());
  return (
    <Box sx={{ minWidth: 0 }}>
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value}
        placeholder="Типовий"
        error={Boolean(error)}
        helperText={error}
        onFocus={() => onFocusField(path)}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { maxLength: 7, sx: { fontFamily: 'var(--admin-font-mono)' } },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  component="input"
                  type="color"
                  aria-label={`${label}: вибрати на палітрі`}
                  value={valid ? value.trim() : '#E8780F'}
                  onChange={(event) =>
                    onChange((event.target as HTMLInputElement).value.toUpperCase())
                  }
                  sx={{ ...swatch, p: 0, cursor: 'pointer', bgcolor: 'transparent' }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
      <Stack direction="row" sx={{ gap: 0.75, mt: 0.75 }}>
        {presets.map((preset) => (
          <Tooltip key={preset.color} title={preset.name}>
            <Box
              component="button"
              type="button"
              aria-label={`${label}: ${preset.name}`}
              aria-pressed={value.trim().toUpperCase() === preset.color}
              onClick={() => onChange(preset.color)}
              sx={{
                ...swatch,
                bgcolor: preset.color,
                cursor: 'pointer',
                outline: value.trim().toUpperCase() === preset.color ? 2 : 0,
                outlineColor: 'text.primary',
                outlineOffset: 1,
              }}
            />
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}

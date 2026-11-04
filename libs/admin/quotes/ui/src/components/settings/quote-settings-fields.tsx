import { quoteSettingsShortMax, quoteSettingsTextMax } from '@admin/quotes/model';
import { Box, Card, TextField, Typography } from '@mui/material';

import type { QuoteSettingsErrors } from '@admin/quotes/model';
import type { ReactNode } from 'react';

/** A picture field the page fills: a link plus «Вибрати з фото». */
export type QuoteImageFieldRender = (field: {
  label: string;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
}) => ReactNode;

export function QuoteSettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ p: 2 }} component="section" aria-label={title}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Card>
  );
}

/** Grid of fields: one column on phones, `columns` on wide screens. */
export function QuoteSettingsGrid({
  columns = 2,
  children,
}: {
  columns?: number;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, minmax(0, 1fr))` },
      }}
    >
      {children}
    </Box>
  );
}

interface FieldProps {
  label: string;
  value: string;
  error?: string | undefined;
  helperText?: string;
  required?: boolean;
  multiline?: boolean;
  /** Spans the whole grid row. */
  wide?: boolean;
  onChange: (value: string) => void;
}

export function QuoteSettingsField({
  label,
  value,
  error,
  helperText,
  required,
  multiline,
  wide,
  onChange,
}: FieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value}
      required={required}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      error={Boolean(error)}
      helperText={error ?? helperText}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        htmlInput: { maxLength: multiline ? quoteSettingsTextMax : quoteSettingsShortMax },
      }}
      sx={wide ? { gridColumn: '1 / -1' } : undefined}
    />
  );
}

/** Error lookup for one section: `at('name')` reads `<prefix>.name`. */
export const errorsAt =
  (errors: QuoteSettingsErrors, prefix: string) =>
  (field: string): string | undefined =>
    errors[`${prefix}.${field}`];

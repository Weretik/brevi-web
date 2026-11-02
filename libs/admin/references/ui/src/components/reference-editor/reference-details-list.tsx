import { Box, Typography } from '@mui/material';

export interface ReferenceDetailsItem {
  label: string;
  value: string | null;
  /** Numbers, codes and dates use the mono face. */
  mono?: boolean;
}

/** Read-only label/value pairs; an empty value shows «—». */
export function ReferenceDetailsList({ items }: { items: ReferenceDetailsItem[] }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', gap: 1.5 }}>
      {items.map(({ label, value, mono }) => (
        <Box key={label}>
          <Typography component="dt" variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography
            component="dd"
            variant="body1"
            sx={{
              m: 0,
              whiteSpace: 'pre-line',
              ...(mono && {
                fontFamily: 'var(--admin-font-mono)',
                fontVariantNumeric: 'tabular-nums',
              }),
            }}
          >
            {value?.trim() ? value : '—'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

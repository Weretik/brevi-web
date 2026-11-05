import { Box, Link, Typography } from '@mui/material';

export interface ReferenceDetailsItem {
  label: string;
  value: string | null;
  /** Numbers, codes and dates use the mono face. */
  mono?: boolean;
  /** Makes the value a link, for example a supplier that opens its card. */
  onOpen?: () => void;
}

/** Read-only label/value pairs; an empty value shows «—». */
export function ReferenceDetailsList({ items }: { items: ReferenceDetailsItem[] }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', gap: 1.5 }}>
      {items.map(({ label, value, mono, onOpen }) => (
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
            {value?.trim() ? (
              onOpen ? (
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={onOpen}
                  sx={{ color: 'primary.dark', font: 'inherit', textAlign: 'left' }}
                >
                  {value}
                </Link>
              ) : (
                value
              )
            ) : (
              '—'
            )}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

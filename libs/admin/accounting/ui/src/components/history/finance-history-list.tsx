import { auditActionLabels } from '@admin/accounting/model';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';

import type { FinanceHistoryEntry } from '@admin/accounting/model';

interface Props {
  entries: FinanceHistoryEntry[];
  loading: boolean;
  error: string | null;
}

const timeFormat = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Kyiv',
});

/** «Історія змін» of one record, newest first. */
export function FinanceHistoryList({ entries, loading, error }: Props) {
  if (loading) return <CircularProgress size={20} aria-label="Завантаження історії" />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!entries.length)
    return (
      <Typography variant="body2" color="text.secondary">
        Змін ще немає.
      </Typography>
    );
  return (
    <Stack component="ol" sx={{ m: 0, p: 0, listStyle: 'none', gap: 1 }} aria-label="Історія змін">
      {entries.map((entry) => (
        <Box component="li" key={entry.id}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {auditActionLabels[entry.action]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
              {timeFormat.format(new Date(entry.at))}
            </Box>{' '}
            · {entry.by}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

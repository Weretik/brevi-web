import { Box } from '@mui/material';

import type { QuoteStatus } from '@admin/quotes/model';

interface Props {
  status: QuoteStatus;
  lastSentAt: string | null;
  archived: boolean;
}

/** «Чернетка», «Надіслано 04.11.2026» or «В архіві»: a pill next to the КП title. */
export function QuoteStatusPill({ status, lastSentAt, archived }: Props) {
  const sent = status === 'Sent';
  const label = archived
    ? 'В архіві'
    : sent && lastSentAt
      ? `Надіслано ${new Date(lastSentAt).toLocaleDateString('uk-UA')}`
      : sent
        ? 'Надіслано'
        : 'Чернетка';
  const tone = archived ? 'warning' : sent ? 'info' : null;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1.25,
        borderRadius: 999,
        typography: 'caption',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: tone ? `${tone}.light` : 'action.hover',
        color: tone ? `${tone}.main` : 'text.secondary',
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {label}
    </Box>
  );
}

import { Box } from '@mui/material';

export type ReminderPillTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface Props {
  tone: ReminderPillTone;
  label: string;
}

/** Status pill from the «Цех» system: dot, soft background, always a text label. */
export function ReminderStatusPill({ tone, label }: Props) {
  const neutral = tone === 'neutral';
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1,
        borderRadius: 999,
        typography: 'caption',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: neutral ? 'action.hover' : `${tone}.light`,
        color: neutral ? 'text.secondary' : `${tone}.main`,
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

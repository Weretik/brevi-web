import { Paper, Stack, Typography } from '@mui/material';

import type { SxProps, Theme } from '@mui/material';

interface SettingsCardProps {
  title: string;
  /** A short secondary note on the right of the title, for example a count. */
  note?: React.ReactNode;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

/** One block of a settings read view: an outlined card with an `h6` title, as the design system «Data card». */
export function SettingsCard({ title, note, sx, children }: SettingsCardProps) {
  return (
    <Paper
      variant="outlined"
      component="section"
      sx={[{ p: 2, minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 1.5 }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {note && (
          <Typography variant="body2" color="text.secondary">
            {note}
          </Typography>
        )}
      </Stack>
      {children}
    </Paper>
  );
}

/** A small label over a larger value; the value wraps anywhere so long links never widen the card. */
export function SettingsField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack sx={{ gap: 0.25, minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" component="div" sx={{ overflowWrap: 'anywhere' }}>
        {children}
      </Typography>
    </Stack>
  );
}

/** «Змінено 12.11.2026, 14:00 · Ім'я» under a settings read view. */
export function SettingsChangedLine({ at, by }: { at: string | null; by: string | null }) {
  if (!at) return null;
  return (
    <Typography variant="caption" color="text.secondary">
      Змінено {new Date(at).toLocaleString('uk-UA')}
      {by ? ` · ${by}` : ''}
    </Typography>
  );
}

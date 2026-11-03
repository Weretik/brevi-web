import { Box } from '@mui/material';

export type SewingCardTone = 'success' | 'warning' | 'neutral';

interface Props {
  label: string;
  tone: SewingCardTone;
}

/** «Цех» status pill with a dot and a text label; colour is never the only signal. */
export function SewingCardStatusPill({ label, tone }: Props) {
  const colors =
    tone === 'neutral'
      ? { bgcolor: 'action.hover', color: 'text.secondary' }
      : { bgcolor: `${tone}.light`, color: `${tone}.main` };
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
        ...colors,
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

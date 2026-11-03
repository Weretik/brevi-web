import { Box } from '@mui/material';

interface StaffStatusPillProps {
  blocked: boolean;
}

/** Status pill from the «Цех» system: dot, soft background, always a text label. */
export function StaffStatusPill({ blocked }: StaffStatusPillProps) {
  const tone = blocked ? 'error' : 'success';
  return (
    <Box
      component="span"
      sx={{
        alignItems: 'center',
        bgcolor: `${tone}.light`,
        borderRadius: 999,
        color: `${tone}.main`,
        display: 'inline-flex',
        fontWeight: 600,
        gap: 0.75,
        height: 24,
        px: 1,
        typography: 'caption',
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        aria-hidden
        component="span"
        sx={{ bgcolor: 'currentColor', borderRadius: '50%', height: 6, width: 6 }}
      />
      {blocked ? 'Заблокований' : 'Активний'}
    </Box>
  );
}

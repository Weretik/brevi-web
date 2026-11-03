import { Box, LinearProgress, Typography } from '@mui/material';

export interface MediaUploadFailure {
  fileName: string;
  message: string;
}

interface Props {
  total: number;
  done: number;
  active: boolean;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Progress bar while several photos upload; the result comes as a pop-up notice. */
export function MediaUploadStatus({ total, done, active }: Props) {
  if (!active || total === 0) return null;
  return (
    <Box sx={{ mb: 2 }} role="status">
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Завантаження:{' '}
        <Box component="span" sx={mono}>
          {done}
        </Box>{' '}
        з{' '}
        <Box component="span" sx={mono}>
          {total}
        </Box>
      </Typography>
      <LinearProgress variant="determinate" value={(done / total) * 100} />
    </Box>
  );
}

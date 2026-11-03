import { Alert, Box, LinearProgress, Typography } from '@mui/material';

export interface MediaUploadFailure {
  fileName: string;
  message: string;
}

interface Props {
  total: number;
  done: number;
  active: boolean;
  failures: readonly MediaUploadFailure[];
  onClose: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Progress of a multi-photo upload and the files that did not go through. */
export function MediaUploadStatus({ total, done, active, failures, onClose }: Props) {
  if (total === 0) return null;
  const uploaded = done - failures.length;
  return (
    <Box sx={{ mb: 2 }} role="status">
      {active ? (
        <>
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
        </>
      ) : (
        <Alert severity={failures.length ? 'warning' : 'success'} onClose={onClose}>
          {failures.length === 0
            ? `Завантажено фото: ${uploaded}.`
            : `Завантажено ${uploaded} з ${total}. Не вдалося:`}
          {failures.length > 0 && (
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {failures.map((failure, index) => (
                <li key={`${failure.fileName}-${index}`}>
                  «{failure.fileName}» — {failure.message}
                </li>
              ))}
            </Box>
          )}
        </Alert>
      )}
    </Box>
  );
}

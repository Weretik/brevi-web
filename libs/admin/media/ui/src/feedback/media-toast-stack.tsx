import { Alert, Box, Slide, Stack } from '@mui/material';

export type MediaToastTone = 'success' | 'warning' | 'error';

export interface MediaToast {
  id: number;
  tone: MediaToastTone;
  text: string;
}

interface Props {
  toasts: readonly MediaToast[];
  onClose: (id: number) => void;
}

/**
 * Pop-up notices in the top right corner, under the top bar: green for success, yellow for a
 * warning, red for an error. They close by themselves (see useMediaToasts) or with the cross.
 */
export function MediaToastStack({ toasts, onClose }: Props) {
  return (
    <Stack
      aria-live="polite"
      sx={{
        position: 'fixed',
        top: { xs: 72, sm: 76 },
        right: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 'auto' },
        zIndex: (theme) => theme.zIndex.snackbar,
        gap: 1,
        width: { sm: 380 },
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <Slide key={toast.id} in direction="left" appear>
          <Box sx={{ pointerEvents: 'auto' }}>
            <Alert
              variant="filled"
              severity={toast.tone}
              role={toast.tone === 'error' ? 'alert' : 'status'}
              onClose={() => onClose(toast.id)}
              sx={{ boxShadow: 6, whiteSpace: 'pre-line', alignItems: 'flex-start' }}
            >
              {toast.text}
            </Alert>
          </Box>
        </Slide>
      ))}
    </Stack>
  );
}

import { Box, Button, Stack, Typography } from '@mui/material';

interface CrashPageProps {
  fullScreen?: boolean;
  onRetry: () => void;
}

/** 500 for a screen that failed while rendering; the layout around it keeps working. */
export function CrashPage({ fullScreen = false, onRetry }: CrashPageProps) {
  return (
    <Box
      role="alert"
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : 360,
        p: 3,
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 440, textAlign: 'center' }}>
        <Typography color="text.secondary" sx={{ fontFamily: 'monospace' }} variant="body2">
          500
        </Typography>
        <Typography component="h1" variant="h5">
          Щось пішло не так
        </Typography>
        <Typography color="text.secondary">
          Сталася неочікувана помилка. Спробуйте ще раз; якщо вона повториться, повідомте
          адміністратора.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={onRetry} variant="contained">
            Спробувати ще раз
          </Button>
          <Button href="/" variant="outlined">
            На головну
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

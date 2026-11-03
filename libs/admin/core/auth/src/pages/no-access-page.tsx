import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { logout } from '../session/auth-session';

interface NoAccessPageProps {
  /** Full screen outside the admin layout, for an account that is not staff. */
  fullScreen?: boolean;
}

export function NoAccessPage({ fullScreen = false }: NoAccessPageProps) {
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
      <Stack spacing={2} sx={{ alignItems: 'center', maxWidth: 420, textAlign: 'center' }}>
        <LockOutlinedIcon color="disabled" sx={{ fontSize: 48 }} />
        <Typography component="h1" variant="h5">
          Немає доступу
        </Typography>
        <Typography color="text.secondary">
          {fullScreen
            ? 'Цей обліковий запис не має доступу до кабінету співробітника. Увійдіть під обліковим записом співробітника.'
            : 'Ваша роль не дозволяє відкрити цей розділ. Зверніться до адміністратора.'}
        </Typography>
        {fullScreen ? (
          <Button onClick={() => void logout()} variant="contained">
            Увійти під іншим обліковим записом
          </Button>
        ) : (
          <Button component={RouterLink} to="/" variant="outlined">
            На головну
          </Button>
        )}
      </Stack>
    </Box>
  );
}

import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getLoginErrorMessage } from './login-error-message';
import { readReturnPath } from '../routes/login-return-path';
import { login } from '../session/auth-session';
import { useAdminSession } from '../session/use-admin-session';

import type { FormEvent } from 'react';

const defaultReturnPath = '/';

export function LoginPage() {
  const session = useAdminSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const returnPath = readReturnPath(location.search, defaultReturnPath);

  if (session.status === 'authenticated' && !isSubmitting) {
    return <Navigate replace to={returnPath} />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(returnPath, { replace: true });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Paper
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ maxWidth: 400, p: { xs: 3, sm: 4 }, width: '100%' }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography component="h1" variant="h5">
              Вхід до кабінету
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Brevi — кабінет співробітника
            </Typography>
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            autoComplete="username"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <TextField
            autoComplete="current-password"
            label="Пароль"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          <Button
            disabled={isSubmitting || !email.trim() || !password}
            size="large"
            type="submit"
            variant="contained"
          >
            {isSubmitting ? 'Вхід…' : 'Увійти'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

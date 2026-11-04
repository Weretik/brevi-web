import {
  Alert,
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getLoginErrorMessage } from './login-error-message';
import { LoginIntroPanel } from '../components/login/login-intro-panel';
import { PasswordField } from '../components/login/password-field';
import { readReturnPath } from '../routes/login-return-path';
import { login } from '../session/auth-session';
import { useAdminSession } from '../session/use-admin-session';

import type { FormEvent } from 'react';

const defaultReturnPath = '/';

const legalLinks = [
  { label: 'Конфіденційність', href: '/brevi-erp/privacy.html' },
  { label: 'Умови використання', href: '/brevi-erp/terms.html' },
] as const;

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
    <Box sx={{ bgcolor: 'background.default', display: 'flex', minHeight: '100vh' }}>
      <LoginIntroPanel />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 3,
          justifyContent: 'center',
          minWidth: 0,
          p: { xs: 2, sm: 6 },
        }}
      >
        <Box
          alt="Brevi"
          component="img"
          src="/assets/logo/brevi-logo-dark.png"
          sx={{ display: { xs: 'block', md: 'none' }, height: 'auto', width: 112 }}
        />
        <Paper
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ borderRadius: 4, maxWidth: 400, p: { xs: 3, sm: 5 }, width: '100%' }}
          variant="outlined"
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography component="h1" sx={{ fontWeight: 700 }} variant="h5">
                Вхід у Brevi Office
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                Увійдіть робочим email і паролем.
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
            <PasswordField onChange={setPassword} value={password} />
            <Button
              disabled={isSubmitting || !email.trim() || !password}
              size="large"
              type="submit"
              variant="contained"
            >
              {isSubmitting ? 'Вхід…' : 'Увійти'}
            </Button>
            <Typography color="text.secondary" variant="body2">
              Забули пароль або немає доступу? Зверніться до адміністратора — він видає доступ і
              новий пароль.
            </Typography>
            <Divider />
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              {legalLinks.map((link) => (
                <Link href={link.href} key={link.href} variant="body2">
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

import { Box, CircularProgress } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';

import { buildLoginPath } from './login-return-path';
import { NoAccessPage } from '../pages/no-access-page';
import { isStaff } from '../session/session-user';
import { useAdminSession } from '../session/use-admin-session';

import type { SessionUser } from '../session/session-user';
import type { ReactNode } from 'react';

interface RequireAdminSessionProps {
  children: (user: SessionUser) => ReactNode;
}

/** Renders the admin only for signed-in staff; otherwise the login page or "no access". */
export function RequireAdminSession({ children }: RequireAdminSessionProps) {
  const session = useAdminSession();
  const location = useLocation();

  if (session.status === 'loading') {
    return (
      <Box
        sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100vh' }}
      >
        <CircularProgress aria-label="Перевірка сесії" />
      </Box>
    );
  }

  if (session.status === 'anonymous') {
    return <Navigate replace to={buildLoginPath(`${location.pathname}${location.search}`)} />;
  }

  if (!isStaff(session.user)) {
    return <NoAccessPage fullScreen />;
  }

  return <>{children(session.user)}</>;
}

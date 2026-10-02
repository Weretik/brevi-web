import { logout } from '@admin/core/auth';
import { AdminShellSessionProvider } from '@admin/core/shell';
import { AdminApiProvider } from '@admin/shared/api-client';
import { BrowserRouter } from 'react-router-dom';

import { ColorModeProvider } from './color-mode-provider';

import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AdminApiProvider>
      <AdminShellSessionProvider onLogout={logout}>
        <ColorModeProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ColorModeProvider>
      </AdminShellSessionProvider>
    </AdminApiProvider>
  );
}

import { logout } from '@admin/core/auth';
import { AdminShellSessionProvider } from '@admin/core/shell';
import { AdminApiProvider } from '@admin/shared/api-client';

import { ColorModeProvider } from './color-mode-provider';

import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AdminApiProvider>
      <AdminShellSessionProvider onLogout={logout}>
        <ColorModeProvider>{children}</ColorModeProvider>
      </AdminShellSessionProvider>
    </AdminApiProvider>
  );
}

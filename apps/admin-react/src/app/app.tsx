import { RouteErrorBoundary } from '@admin/core/shell';

import { AppProviders } from './providers/app-providers';
import { AppRouter } from './router/app-router';

import type { createAdminRouter } from './router/create-admin-router';

export function App({ router }: { router?: ReturnType<typeof createAdminRouter> }) {
  return (
    <AppProviders>
      <RouteErrorBoundary fullScreen>
        <AppRouter router={router} />
      </RouteErrorBoundary>
    </AppProviders>
  );
}

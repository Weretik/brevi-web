import { AppProviders } from './providers/app-providers';
import { AppRouter } from './router/app-router';

import type { createAdminRouter } from './router/create-admin-router';

export function App({ router }: { router?: ReturnType<typeof createAdminRouter> }) {
  return (
    <AppProviders>
      <AppRouter router={router} />
    </AppProviders>
  );
}

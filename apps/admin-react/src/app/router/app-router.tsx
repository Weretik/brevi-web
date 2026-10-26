import { RouterProvider } from 'react-router-dom';

import { createAdminRouter } from './create-admin-router';

// Keep the browser history subscription outside React's repeated render lifecycle.
const browserRouter = createAdminRouter();

export function AppRouter({ router }: { router?: ReturnType<typeof createAdminRouter> }) {
  return <RouterProvider router={router ?? browserRouter} />;
}

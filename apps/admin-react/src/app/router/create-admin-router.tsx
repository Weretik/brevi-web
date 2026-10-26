import { createBrowserRouter } from 'react-router-dom';

import { adminRouteDefinitions } from './admin-route-definitions';
import { AdminRouteLayout } from './admin-route-layout';
import { NotFoundPage } from '../pages/not-found-page';

export function createAdminRouter() {
  return createBrowserRouter([
    {
      element: <AdminRouteLayout />,
      children: [...adminRouteDefinitions, { path: '*', element: <NotFoundPage /> }],
    },
  ]);
}

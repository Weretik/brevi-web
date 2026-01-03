import { Route } from '@angular/router';

export const orderInBulkRoutes: Route[] = [
  {
    path: 'order-in-bulk',
    loadComponent: () =>
      import('./page/order-in-bulk-page/order-in-bulk-page').then((m) => m.OrderInBulkPage),
  },
];

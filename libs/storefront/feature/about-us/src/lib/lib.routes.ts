import { Route } from '@angular/router';

export const aboutUsRoutes: Route[] = [
  {
    path: 'about-company',
    loadComponent: () => import('./pages/about-company/about-company').then((m) => m.AboutCompany),
  },
  {
    path: 'delivery-and-payment',
    loadComponent: () =>
      import('./pages/delivery-and-payment/delivery-and-payment').then((m) => m.DeliveryAndPayment),
  },
];

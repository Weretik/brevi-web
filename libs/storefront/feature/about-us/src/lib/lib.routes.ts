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
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles-page/articles-page').then((m) => m.ArticlesPage),
  },
  {
    path: 'agreement',
    loadComponent: () =>
      import('./pages/agreement-page/agreement-page').then((m) => m.AgreementPage),
  },
  {
    path: 'returns-exchanges',
    loadComponent: () =>
      import('./pages/returns-exchanges-page/returns-exchanges-page').then(
        (m) => m.ReturnsExchangesPage,
      ),
  },
  {
    path: 'our-work',
    loadComponent: () => import('./pages/our-work-page/our-work-page').then((m) => m.OurWorkPage),
  },
  {
    path: 'certificates',
    loadComponent: () =>
      import('./pages/certificates-page/certificates-page').then((m) => m.CertificatesPage),
  },
];

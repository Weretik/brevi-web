import { lazy } from 'react';

import type { ContentProductsViewer } from '@admin/content/model';
import type { RouteObject } from 'react-router-dom';

const LegalDocumentsPage = lazy(() => import('./pages/legal/legal-documents-page'));
const ContentProductsPage = lazy(() => import('./pages/product-pages/content-products-page'));

export const contentProductsPath = '/content/products';

export interface ContentRouteOptions {
  /** Rights of the signed-in staff member on «Товари сайту»; the app reads them from the session. */
  useContentProductsViewer: () => ContentProductsViewer;
}

/**
 * «Контент»: public content of Brevi sites. «Товари сайту» sits behind «Права доступу»
 * (`content-products`); the public BreviERP documents are open to every staff member.
 */
export function createContentRoutes({
  useContentProductsViewer,
}: ContentRouteOptions): (RouteObject & { path: string })[] {
  function Products() {
    return <ContentProductsPage viewer={useContentProductsViewer()} />;
  }
  return [
    { path: contentProductsPath, element: <Products /> },
    { path: '/content/legal', element: <LegalDocumentsPage /> },
  ];
}

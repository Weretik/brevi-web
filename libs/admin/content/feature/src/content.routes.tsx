import { lazy } from 'react';

import type { ContentProductsViewer, SiteCategoriesViewer } from '@admin/content/model';
import type { RouteObject } from 'react-router-dom';

const LegalDocumentsPage = lazy(() => import('./pages/legal/legal-documents-page'));
const ContentProductsPage = lazy(() => import('./pages/product-pages/content-products-page'));
const SiteCategoriesPage = lazy(() => import('./pages/site-categories/site-categories-page'));

export const contentProductsPath = '/content/products';
export const siteCategoriesPath = '/content/categories';

export interface ContentRouteOptions {
  /** Rights of the signed-in staff member on «Товари сайту»; the app reads them from the session. */
  useContentProductsViewer: () => ContentProductsViewer;
  /** Rights on «Розділи сайту», read the same way. */
  useSiteCategoriesViewer: () => SiteCategoriesViewer;
}

/**
 * «Контент»: public content of Brevi sites. «Товари сайту» and «Розділи сайту» sit behind «Права
 * доступу» (`content-products`, `content-categories`); the public BreviERP documents are open to every staff member.
 */
export function createContentRoutes({
  useContentProductsViewer,
  useSiteCategoriesViewer,
}: ContentRouteOptions): (RouteObject & { path: string })[] {
  function Products() {
    return <ContentProductsPage viewer={useContentProductsViewer()} />;
  }
  function Categories() {
    return <SiteCategoriesPage viewer={useSiteCategoriesViewer()} />;
  }
  return [
    { path: contentProductsPath, element: <Products /> },
    { path: siteCategoriesPath, element: <Categories /> },
    { path: '/content/legal', element: <LegalDocumentsPage /> },
  ];
}

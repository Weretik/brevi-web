import { lazy } from 'react';

import type {
  ArticlesViewer,
  ContentProductsViewer,
  RedirectsViewer,
  SeoSettingsViewer,
  SiteCategoriesViewer,
} from '@admin/content/model';
import type { RouteObject } from 'react-router-dom';

const ArticlesPage = lazy(() => import('./pages/articles/articles-page'));
const LegalDocumentsPage = lazy(() => import('./pages/legal/legal-documents-page'));
const ContentProductsPage = lazy(() => import('./pages/product-pages/content-products-page'));
const RedirectsPage = lazy(() => import('./pages/redirects/redirects-page'));
const SeoSettingsPage = lazy(() => import('./pages/seo-settings/seo-settings-page'));
const SiteCategoriesPage = lazy(() => import('./pages/site-categories/site-categories-page'));

export const contentProductsPath = '/content/products';
export const siteCategoriesPath = '/content/categories';
export const articlesPath = '/content/articles';
export const redirectsPath = '/content/redirects';
export const seoSettingsPath = '/content/seo-settings';

export interface ContentRouteOptions {
  /** Rights of the signed-in staff member on «Товари сайту»; the app reads them from the session. */
  useContentProductsViewer: () => ContentProductsViewer;
  /** Rights on «Розділи сайту», read the same way. */
  useSiteCategoriesViewer: () => SiteCategoriesViewer;
  /** Rights on «Статті», read the same way. */
  useArticlesViewer: () => ArticlesViewer;
  /** Rights on «Переадресації», read the same way. */
  useRedirectsViewer: () => RedirectsViewer;
  /** Rights on «Налаштування SEO сайту», read the same way. */
  useSeoSettingsViewer: () => SeoSettingsViewer;
}

/**
 * «Контент»: public content of Brevi sites. «Товари сайту», «Розділи сайту», «Статті», «Переадресації» and
 * «Налаштування SEO сайту» sit behind «Права доступу» (`content-products`, `content-categories`,
 * `content-articles`, `content-redirects`, `content-seo-settings`); the public BreviERP
 * documents are open to every staff member.
 */
export function createContentRoutes({
  useContentProductsViewer,
  useSiteCategoriesViewer,
  useArticlesViewer,
  useRedirectsViewer,
  useSeoSettingsViewer,
}: ContentRouteOptions): (RouteObject & { path: string })[] {
  function Products() {
    return <ContentProductsPage viewer={useContentProductsViewer()} />;
  }
  function Categories() {
    return <SiteCategoriesPage viewer={useSiteCategoriesViewer()} />;
  }
  function Articles() {
    return <ArticlesPage viewer={useArticlesViewer()} />;
  }
  function Redirects() {
    return <RedirectsPage viewer={useRedirectsViewer()} />;
  }
  function SeoSettings() {
    return <SeoSettingsPage viewer={useSeoSettingsViewer()} />;
  }
  return [
    { path: contentProductsPath, element: <Products /> },
    { path: siteCategoriesPath, element: <Categories /> },
    { path: articlesPath, element: <Articles /> },
    { path: redirectsPath, element: <Redirects /> },
    { path: seoSettingsPath, element: <SeoSettings /> },
    { path: '/content/legal', element: <LegalDocumentsPage /> },
  ];
}

import { lazy } from 'react';

import {
  articlesPath,
  companyPath,
  contentProductsPath,
  redirectsPath,
  seoOverviewPath,
  seoSettingsPath,
  siteCategoriesPath,
  sitePagesPath,
} from './model/content-paths';

import type {
  ArticlesViewer,
  ContentProductsViewer,
  RedirectsViewer,
  SeoSettingsViewer,
  SiteCompanyViewer,
  SitePagesViewer,
  SiteCategoriesViewer,
} from '@admin/content/model';
import type { RouteObject } from 'react-router-dom';

const ArticlesPage = lazy(() => import('./pages/articles/articles-page'));
const LegalDocumentsPage = lazy(() => import('./pages/legal/legal-documents-page'));
const ContentProductsPage = lazy(() => import('./pages/product-pages/content-products-page'));
const RedirectsPage = lazy(() => import('./pages/redirects/redirects-page'));
const SiteCompanyPage = lazy(() => import('./pages/company/site-company-page'));
const SeoOverviewPage = lazy(() => import('./pages/seo-overview/seo-overview-page'));
const SeoSettingsPage = lazy(() => import('./pages/seo-settings/seo-settings-page'));
const SitePagesPage = lazy(() => import('./pages/site-pages/site-pages-page'));
const SiteCategoriesPage = lazy(() => import('./pages/site-categories/site-categories-page'));

export {
  articlesPath,
  companyPath,
  contentProductsPath,
  redirectsPath,
  seoOverviewPath,
  seoSettingsPath,
  siteCategoriesPath,
  sitePagesPath,
};

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
  /** Rights on «Сторінки сайту», read the same way. */
  useSitePagesViewer: () => SitePagesViewer;
  /** Rights on «Контакти та компанія», read the same way. */
  useSiteCompanyViewer: () => SiteCompanyViewer;
}

/**
 * «Контент»: public content of Brevi sites. «Товари сайту», «Розділи сайту», «Статті», «Переадресації»,
 * «Налаштування SEO сайту» and «Сторінки сайту» sit behind «Права доступу» (`content-products`, `content-categories`,
 * `content-articles`, `content-redirects`, `content-seo-settings`, `content-site-pages`); the read-only «SEO-огляд»
 * behind `content-seo-overview` and «Контакти та компанія» behind `content-company` too. The public BreviERP documents are open to every staff member.
 */
export function createContentRoutes({
  useContentProductsViewer,
  useSiteCategoriesViewer,
  useArticlesViewer,
  useRedirectsViewer,
  useSeoSettingsViewer,
  useSitePagesViewer,
  useSiteCompanyViewer,
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
  function SitePages() {
    return <SitePagesPage viewer={useSitePagesViewer()} />;
  }
  function Company() {
    return <SiteCompanyPage viewer={useSiteCompanyViewer()} />;
  }
  return [
    { path: contentProductsPath, element: <Products /> },
    { path: siteCategoriesPath, element: <Categories /> },
    { path: articlesPath, element: <Articles /> },
    { path: redirectsPath, element: <Redirects /> },
    { path: seoSettingsPath, element: <SeoSettings /> },
    { path: sitePagesPath, element: <SitePages /> },
    { path: seoOverviewPath, element: <SeoOverviewPage /> },
    { path: companyPath, element: <Company /> },
    { path: '/content/legal', element: <LegalDocumentsPage /> },
  ];
}

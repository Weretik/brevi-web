import { lazy } from 'react';

import {
  articlesPath,
  certificatesPath,
  companyPath,
  contentProductsPath,
  redirectsPath,
  seoOverviewPath,
  seoSettingsPath,
  siteCategoriesPath,
  sitePagesPath,
  worksPath,
} from './model/content-paths';

import type {
  ArticlesViewer,
  ContentProductsViewer,
  RedirectsViewer,
  SeoSettingsViewer,
  SiteCompanyViewer,
  SiteGalleryViewer,
  SitePagesViewer,
  SiteCategoriesViewer,
} from '@admin/content/model';
import type { RouteObject } from 'react-router-dom';

const ArticlesPage = lazy(() => import('./pages/articles/articles-page'));
const LegalDocumentsPage = lazy(() => import('./pages/legal/legal-documents-page'));
const ContentProductsPage = lazy(() => import('./pages/product-pages/content-products-page'));
const RedirectsPage = lazy(() => import('./pages/redirects/redirects-page'));
const SiteCompanyPage = lazy(() => import('./pages/company/site-company-page'));
const SiteCertificatesPage = lazy(() => import('./pages/galleries/site-certificates-page'));
const SiteWorksPage = lazy(() => import('./pages/galleries/site-works-page'));
const SeoOverviewPage = lazy(() => import('./pages/seo-overview/seo-overview-page'));
const SeoSettingsPage = lazy(() => import('./pages/seo-settings/seo-settings-page'));
const SitePagesPage = lazy(() => import('./pages/site-pages/site-pages-page'));
const SiteCategoriesPage = lazy(() => import('./pages/site-categories/site-categories-page'));

export {
  articlesPath,
  certificatesPath,
  companyPath,
  contentProductsPath,
  redirectsPath,
  seoOverviewPath,
  seoSettingsPath,
  siteCategoriesPath,
  sitePagesPath,
  worksPath,
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
  /** Rights on «Наші роботи», read the same way. */
  useSiteWorksViewer: () => SiteGalleryViewer;
  /** Rights on «Сертифікати», read the same way. */
  useSiteCertificatesViewer: () => SiteGalleryViewer;
}

/**
 * «Контент»: public content of Brevi sites. «Товари сайту», «Розділи сайту», «Статті», «Переадресації»,
 * «Налаштування SEO сайту» and «Сторінки сайту» sit behind «Права доступу» (`content-products`, `content-categories`,
 * `content-articles`, `content-redirects`, `content-seo-settings`, `content-site-pages`); the read-only «SEO-огляд»
 * behind `content-seo-overview`, «Контакти та компанія» behind `content-company`, «Наші роботи» and «Сертифікати» behind
 * `content-works` and `content-certificates` too. The public BreviERP documents are open to every staff member.
 */
export function createContentRoutes({
  useContentProductsViewer,
  useSiteCategoriesViewer,
  useArticlesViewer,
  useRedirectsViewer,
  useSeoSettingsViewer,
  useSitePagesViewer,
  useSiteCompanyViewer,
  useSiteWorksViewer,
  useSiteCertificatesViewer,
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
  function Works() {
    return <SiteWorksPage viewer={useSiteWorksViewer()} />;
  }
  function Certificates() {
    return <SiteCertificatesPage viewer={useSiteCertificatesViewer()} />;
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
    { path: worksPath, element: <Works /> },
    { path: certificatesPath, element: <Certificates /> },
    { path: '/content/legal', element: <LegalDocumentsPage /> },
  ];
}

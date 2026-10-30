import { lazy } from 'react';

const CustomersPage = lazy(() => import('./pages/customers/list/customers-page'));
const CustomerCreatePage = lazy(() => import('./pages/customers/create/customer-create-page'));
const CustomerDetailPage = lazy(() => import('./pages/customers/detail/customer-detail-page'));
const IntroductionsPage = lazy(() => import('./pages/introductions/introductions-page'));
const QuotesPage = lazy(() => import('./pages/quotes/list/quotes-page'));
const QuoteEditorPage = lazy(() => import('./pages/quotes/editor/quote-editor-page'));
const QuoteHistoryPage = lazy(() => import('./pages/quotes/history/quote-history-page'));
const IssuerSettingsPage = lazy(() => import('./pages/documents/issuer-settings-page'));
const CustomEditorPage = lazy(() => import('./pages/custom-sewing/custom-editor-page'));
export const clientsRoutes = [
  { path: '/crm/custom-sewing/new', element: <CustomEditorPage /> },
  { path: '/crm/custom-sewing/:draftId', element: <CustomEditorPage /> },
  { path: '/crm/clients', element: <CustomersPage /> },
  { path: '/crm/clients/new', element: <CustomerCreatePage /> },
  { path: '/crm/clients/:customerId', element: <CustomerDetailPage /> },
  { path: '/crm/quotes', element: <QuotesPage /> },
  { path: '/crm/quotes/introductions', element: <IntroductionsPage /> },
  { path: '/crm/quotes/archive', element: <QuotesPage archivedView /> },
  { path: '/crm/quotes/new', element: <QuoteEditorPage /> },
  { path: '/crm/quotes/:quoteId', element: <QuoteEditorPage /> },
  { path: '/crm/quotes/:quoteId/history', element: <QuoteHistoryPage /> },
  { path: '/crm/issuer-settings', element: <IssuerSettingsPage /> },
] as const;

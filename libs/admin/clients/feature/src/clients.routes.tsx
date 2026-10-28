import { lazy } from 'react';

const CustomersPage = lazy(() => import('./pages/customers/list/customers-page'));
const CustomerCreatePage = lazy(() => import('./pages/customers/create/customer-create-page'));
const CustomerDetailPage = lazy(() => import('./pages/customers/detail/customer-detail-page'));
const QuotesPage = lazy(() => import('./pages/quotes/list/quotes-page'));
const QuoteEditorPage = lazy(() => import('./pages/quotes/editor/quote-editor-page'));
export const clientsRoutes = [
  { path: '/crm/clients', element: <CustomersPage /> },
  { path: '/crm/clients/new', element: <CustomerCreatePage /> },
  { path: '/crm/clients/:customerId', element: <CustomerDetailPage /> },
  { path: '/crm/quotes', element: <QuotesPage /> },
  { path: '/crm/quotes/new', element: <QuoteEditorPage /> },
  { path: '/crm/quotes/:quoteId', element: <QuoteEditorPage /> },
] as const;

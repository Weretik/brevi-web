import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import type { QuoteActor } from '@admin/quotes/model';
import type { RouteObject } from 'react-router-dom';

const QuotesPage = lazy(() => import('./pages/list/quotes-page'));
const QuoteEditorPage = lazy(() => import('./pages/editor/quote-editor-page'));
const QuoteSettingsPage = lazy(() => import('./pages/settings/quote-settings-page'));

export interface QuotesRouteOptions {
  /** The signed-in staff member; the app reads it from the session. */
  useQuoteActor: () => QuoteActor;
}

/** «Менеджер сервісу → КП»: the list, the «Товари та ціни» editor and «Налаштування КП» (Director and Admin). */
export function createQuotesRoutes({
  useQuoteActor,
}: QuotesRouteOptions): (RouteObject & { path: string })[] {
  function List() {
    return <QuotesPage actor={useQuoteActor()} />;
  }
  function Editor() {
    return <QuoteEditorPage actor={useQuoteActor()} />;
  }
  function Settings() {
    return useQuoteActor().canSeeAll ? (
      <QuoteSettingsPage />
    ) : (
      <Navigate to="/crm/quotes" replace />
    );
  }
  return [
    { path: '/crm/quotes', element: <List /> },
    { path: '/crm/quotes/new', element: <Editor /> },
    { path: '/crm/quote-settings', element: <Settings /> },
    { path: '/crm/quotes/:quoteId', element: <Editor /> },
  ];
}

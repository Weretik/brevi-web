import { lazy } from 'react';

import type { QuoteActor } from '@admin/quotes/model';
import type { RouteObject } from 'react-router-dom';

const QuotesPage = lazy(() => import('./pages/list/quotes-page'));
const QuoteEditorPage = lazy(() => import('./pages/editor/quote-editor-page'));

export interface QuotesRouteOptions {
  /** The signed-in staff member; the app reads it from the session. */
  useQuoteActor: () => QuoteActor;
}

/** «Менеджер сервісу → КП»: the list and the «Товари та ціни» editor. */
export function createQuotesRoutes({
  useQuoteActor,
}: QuotesRouteOptions): (RouteObject & { path: string })[] {
  function List() {
    return <QuotesPage actor={useQuoteActor()} />;
  }
  function Editor() {
    return <QuoteEditorPage actor={useQuoteActor()} />;
  }
  return [
    { path: '/crm/quotes', element: <List /> },
    { path: '/crm/quotes/new', element: <Editor /> },
    { path: '/crm/quotes/:quoteId', element: <Editor /> },
  ];
}

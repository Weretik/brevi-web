import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import type { QuoteSupplierCard } from './pages/editor/quote-supplier-card';
import type { QuoteActor } from '@admin/quotes/model';
import type { RouteObject } from 'react-router-dom';

export type {
  QuoteSupplierCard,
  QuoteSupplierCardTarget,
} from './pages/editor/quote-supplier-card';

const QuotesPage = lazy(() => import('./pages/list/quotes-page'));
const QuoteEditorPage = lazy(() => import('./pages/editor/quote-editor-page'));
const QuoteSettingsPage = lazy(() => import('./pages/settings/quote-settings-page'));
const QuoteIntroductionPage = lazy(() => import('./pages/introduction/quote-introduction-page'));

export interface QuotesRouteOptions {
  /** The signed-in staff member; the app reads it from the session. */
  useQuoteActor: () => QuoteActor;
  /** The supplier card opened from a fabric (R-32); the app supplies it from «Контрагенти». */
  useSupplierCard?: () => QuoteSupplierCard;
}

const noSupplierCard: QuoteSupplierCard = { open: null, element: null };
const useNoSupplierCard = () => noSupplierCard;

/**
 * «Менеджер сервісу → КП»: the list, the «Товари та ціни» editor, «КП для знайомства» and «Налаштування КП»
 * (Director and Admin).
 */
export function createQuotesRoutes({
  useQuoteActor,
  useSupplierCard = useNoSupplierCard,
}: QuotesRouteOptions): (RouteObject & { path: string })[] {
  function List() {
    return <QuotesPage actor={useQuoteActor()} />;
  }
  function Editor() {
    return <QuoteEditorPage actor={useQuoteActor()} supplierCard={useSupplierCard()} />;
  }
  function Introduction() {
    return <QuoteIntroductionPage actor={useQuoteActor()} />;
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
    { path: '/crm/quote-introductions/new', element: <Introduction /> },
    { path: '/crm/quote-introductions/:quoteId', element: <Introduction /> },
  ];
}

import { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { QuoteSupplierCard, QuoteWorkshopCard } from './pages/editor/quote-supplier-card';
import type { QuoteActor } from '@admin/quotes/model';
import type { RouteObject } from 'react-router-dom';

export type {
  QuoteSupplierCard,
  QuoteSupplierCardTarget,
  QuoteWorkshopCard,
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
  /** «Цех» in the КП editor: its orders and «Передати в цех»; the app supplies it from «Виробничі завдання». */
  workshopCard?: QuoteWorkshopCard;
}

const noSupplierCard: QuoteSupplierCard = { open: null, element: null };
const useNoSupplierCard = () => noSupplierCard;

/**
 * «Менеджер сервісу → КП»: the list, the «Товари та ціни» editor and «КП для знайомства»; plus
 * «Адміністрування → Налаштування КП» (Director and Admin), with `/crm/quote-settings` redirecting to it.
 */
export function createQuotesRoutes({
  useQuoteActor,
  useSupplierCard = useNoSupplierCard,
  workshopCard,
}: QuotesRouteOptions): (RouteObject & { path: string })[] {
  function List() {
    return <QuotesPage actor={useQuoteActor()} />;
  }
  function Editor() {
    return (
      <QuoteEditorPage
        actor={useQuoteActor()}
        supplierCard={useSupplierCard()}
        workshopCard={workshopCard}
      />
    );
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
  /** The page moved from «Менеджер сервісу» to «Адміністрування»: old links and bookmarks keep working. */
  function LegacySettingsLink() {
    const { search, hash } = useLocation();
    return <Navigate to={{ pathname: '/admin/quote-settings', search, hash }} replace />;
  }
  return [
    { path: '/crm/quotes', element: <List /> },
    { path: '/crm/quotes/new', element: <Editor /> },
    { path: '/admin/quote-settings', element: <Settings /> },
    { path: '/crm/quote-settings', element: <LegacySettingsLink /> },
    { path: '/crm/quotes/:quoteId', element: <Editor /> },
    { path: '/crm/quote-introductions/new', element: <Introduction /> },
    { path: '/crm/quote-introductions/:quoteId', element: <Introduction /> },
  ];
}

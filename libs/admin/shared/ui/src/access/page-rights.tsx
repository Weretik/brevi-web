import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

/** What «Права доступу» lets a role do on a page besides seeing it. */
export type PageAction = 'create' | 'edit' | 'delete';

/**
 * Answers whether the signed-in user may do an action. Without `page` it asks about the page the user is on (the
 * route's page of «Права доступу»); a tab or block of another page names that page.
 */
export type CanDo = (action: PageAction, page?: string) => boolean;

const allowEverything: CanDo = () => true;

const PageRightsContext = createContext<CanDo>(allowEverything);

/** Given by the app around its pages; features and their UI read it with `usePageRights`. */
export function PageRightsProvider({ can, children }: { can: CanDo; children: ReactNode }) {
  return <PageRightsContext.Provider value={can}>{children}</PageRightsContext.Provider>;
}

/**
 * Rights on the current page: hide a «Додати», «Редагувати» or «Видалити» control the server would refuse. Outside
 * the app (component tests) everything is allowed.
 */
export function usePageRights() {
  const can = useContext(PageRightsContext);
  return {
    can,
    canCreate: can('create'),
    canEdit: can('edit'),
    canDelete: can('delete'),
  };
}

/**
 * A tab or block that belongs to another page of «Права доступу» than the route (for example the «Зарплата» tab of
 * «Персонал цеху»): controls inside it ask about `page`.
 */
export function PageRightsScope({ page, children }: { page: string; children: ReactNode }) {
  const parent = useContext(PageRightsContext);
  const scoped: CanDo = (action, other) => parent(action, other ?? page);
  return <PageRightsContext.Provider value={scoped}>{children}</PageRightsContext.Provider>;
}

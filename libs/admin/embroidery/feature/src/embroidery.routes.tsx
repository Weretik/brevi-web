import { lazy } from 'react';

import type { EmbroideryViewer } from './model/embroidery-viewer';
import type { RouteObject } from 'react-router-dom';

const EmbroideryPricePage = lazy(() => import('./pages/embroidery-price-page'));

export interface EmbroideryRouteOptions {
  /** The signed-in staff member; the app reads it from the session. */
  useEmbroideryViewer: () => EmbroideryViewer;
}

/** «Менеджер сервісу › Ціна вишивки»; the app puts it behind the Admin or Manager role. */
export function createEmbroideryRoutes({
  useEmbroideryViewer,
}: EmbroideryRouteOptions): (RouteObject & { path: string })[] {
  function Page() {
    return <EmbroideryPricePage viewer={useEmbroideryViewer()} />;
  }
  return [{ path: '/crm/embroidery', element: <Page /> }];
}

import { RedirectsContent } from '../../components/redirects/redirects-content';

import type { RedirectsViewer } from '@admin/content/model';

/** «Контент → Переадресації»: 301 redirects of the public site on their own page. */
export function RedirectsPage({ viewer }: { viewer: RedirectsViewer }) {
  return <RedirectsContent viewer={viewer} />;
}

export default RedirectsPage;

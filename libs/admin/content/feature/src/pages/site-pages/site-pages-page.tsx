import { SitePagesContent } from '../../components/site-pages/site-pages-content';

import type { SitePagesViewer } from '@admin/content/model';

/** «Контент → Сторінки сайту» on its own page. */
export function SitePagesPage({ viewer }: { viewer: SitePagesViewer }) {
  return <SitePagesContent viewer={viewer} />;
}

export default SitePagesPage;

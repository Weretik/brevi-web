import { SiteGalleryContent } from '../../components/galleries/site-gallery-content';

import type { SiteGalleryViewer } from '@admin/content/model';

/** «Контент → Наші роботи» on its own page. */
export function SiteWorksPage({ viewer }: { viewer: SiteGalleryViewer }) {
  return <SiteGalleryContent kind="works" viewer={viewer} />;
}

export default SiteWorksPage;

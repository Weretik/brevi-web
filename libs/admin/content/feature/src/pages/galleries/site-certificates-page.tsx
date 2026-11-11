import { SiteGalleryContent } from '../../components/galleries/site-gallery-content';

import type { SiteGalleryViewer } from '@admin/content/model';

/** «Контент → Сертифікати» on its own page. */
export function SiteCertificatesPage({ viewer }: { viewer: SiteGalleryViewer }) {
  return <SiteGalleryContent kind="certificates" viewer={viewer} />;
}

export default SiteCertificatesPage;

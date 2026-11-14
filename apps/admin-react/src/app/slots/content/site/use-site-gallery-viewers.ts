import { canAccess, useAdminSession } from '@admin/core/auth';

import type { SiteGalleryViewer } from '@admin/content/model';

function useGalleryViewer(page: 'content-works' | 'content-certificates'): SiteGalleryViewer {
  const session = useAdminSession();
  if (session.status !== 'authenticated') return { canEdit: false };
  return { canEdit: canAccess(session.user, page, 'edit') };
}

/** «Контент → Наші роботи»: edit = change the work photos of the site (page `content-works`). */
export function useSiteWorksViewer(): SiteGalleryViewer {
  return useGalleryViewer('content-works');
}

/** «Контент → Сертифікати»: edit = change the documents of the site (page `content-certificates`). */
export function useSiteCertificatesViewer(): SiteGalleryViewer {
  return useGalleryViewer('content-certificates');
}

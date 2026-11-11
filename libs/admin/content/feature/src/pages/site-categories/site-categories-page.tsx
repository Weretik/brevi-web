import { SiteCategoriesContent } from '../../components/site-categories/site-categories-content';

import type { SiteCategoriesViewer } from '@admin/content/model';

/** «Контент → Розділи»: the category tree of the public site on its own page. */
export function SiteCategoriesPage({ viewer }: { viewer: SiteCategoriesViewer }) {
  return <SiteCategoriesContent viewer={viewer} />;
}

export default SiteCategoriesPage;

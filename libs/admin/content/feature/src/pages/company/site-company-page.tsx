import { SiteCompanyContent } from '../../components/company/site-company-content';

import type { SiteCompanyViewer } from '@admin/content/model';

/** «Контент → Контакти та компанія» on its own page. */
export function SiteCompanyPage({ viewer }: { viewer: SiteCompanyViewer }) {
  return <SiteCompanyContent viewer={viewer} />;
}

export default SiteCompanyPage;

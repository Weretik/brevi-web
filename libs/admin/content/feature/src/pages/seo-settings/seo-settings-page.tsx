import { SeoSettingsContent } from '../../components/seo-settings/seo-settings-content';

import type { SeoSettingsViewer } from '@admin/content/model';

/** «Контент → Налаштування SEO сайту» on its own page. */
export function SeoSettingsPage({ viewer }: { viewer: SeoSettingsViewer }) {
  return <SeoSettingsContent viewer={viewer} />;
}

export default SeoSettingsPage;

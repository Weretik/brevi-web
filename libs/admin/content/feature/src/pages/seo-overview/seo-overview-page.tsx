import { SeoOverviewContent } from '../../components/seo-overview/seo-overview-content';

/** «Контент → SEO-огляд» on its own page; read-only, so it needs no rights beyond seeing it. */
export function SeoOverviewPage() {
  return <SeoOverviewContent />;
}

export default SeoOverviewPage;

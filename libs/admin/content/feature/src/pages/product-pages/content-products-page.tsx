import { ContentProductsContent } from '../../components/product-pages/content-products-content';

import type { ContentProductsViewer } from '@admin/content/model';

/** «Контент → Товари»: site pages of products on their own page. */
export function ContentProductsPage({ viewer }: { viewer: ContentProductsViewer }) {
  return <ContentProductsContent viewer={viewer} />;
}

export default ContentProductsPage;

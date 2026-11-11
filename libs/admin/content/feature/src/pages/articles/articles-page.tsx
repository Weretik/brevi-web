import { ArticlesContent } from '../../components/articles/articles-content';

import type { ArticlesViewer } from '@admin/content/model';

/** «Контент → Статті»: articles of the public site on their own page. */
export function ArticlesPage({ viewer }: { viewer: ArticlesViewer }) {
  return <ArticlesContent viewer={viewer} />;
}

export default ArticlesPage;

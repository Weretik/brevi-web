import { CatalogCategoryIcon } from '@site/catalog/ui';

import type { LucideProps } from 'lucide-react';

/** Icon of a catalog section by its key (the category slug), the same as on the catalog root. */
export function CatalogSectionIcon({ sectionKey, ...props }: LucideProps & { sectionKey: string }) {
  return <CatalogCategoryIcon slug={sectionKey} {...props} />;
}

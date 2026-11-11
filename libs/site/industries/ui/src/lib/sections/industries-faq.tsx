import { FaqList } from '@site/shared/ui';

import type { FaqListItem } from '@site/shared/ui';

/** Frequent questions of the page, readable without JavaScript. */
export function IndustriesFaq({ items }: { items: readonly FaqListItem[] }) {
  return <FaqList items={items} className="max-w-[52rem]" />;
}

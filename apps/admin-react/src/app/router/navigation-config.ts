import { legacyGroups } from './legacy-menu';

import type { AdminNavigationGroup } from '@admin/core/shell';

export function createNavigation(
  registeredPaths: ReadonlySet<string>,
  roles: readonly string[] = [],
): readonly AdminNavigationGroup[] {
  return legacyGroups.map((group) => ({
    id: group.id,
    label: group.label,
    items: group.items
      .filter((item) => !item.requiredRole || roles.includes(item.requiredRole))
      .map((item) => ({
        id: item.id,
        label: item.label,
        to: item.path && registeredPaths.has(item.path) ? item.path : undefined,
      })),
  }));
}

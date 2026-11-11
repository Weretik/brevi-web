import { canAccess } from '@admin/core/auth';

import { legacyGroups } from './legacy-menu';

import type { SessionUser } from '@admin/core/auth';
import type { AdminNavigationGroup } from '@admin/core/shell';

/** What the menu needs to know about the signed-in person. */
export type NavigationViewer = Pick<SessionUser, 'roles' | 'access'>;

const nobody: NavigationViewer = { roles: [], access: { allowAll: false, roles: [], grants: {} } };

export function createNavigation(
  registeredPaths: ReadonlySet<string>,
  viewer: NavigationViewer = nobody,
): readonly AdminNavigationGroup[] {
  return legacyGroups
    .map((group) => ({
      id: group.id,
      label: group.label,
      icon: group.icon,
      section: group.section,
      items: group.items
        .filter(
          (item) =>
            (!item.requiredRoles ||
              item.requiredRoles.some((role) => viewer.roles.includes(role))) &&
            (!item.access || [item.access].flat().some((page) => canAccess(viewer, page))),
        )
        .map((item) => ({
          id: item.id,
          label: item.label,
          to: item.path && registeredPaths.has(item.path) ? item.path : undefined,
        })),
    }))
    .filter((group) => group.items.length > 0);
}

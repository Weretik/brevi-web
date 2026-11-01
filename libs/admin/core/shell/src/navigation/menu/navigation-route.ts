import type { AdminNavigationGroup, AdminNavigationItem } from '../../shell.types';

export function matchesRoute(pathname: string, to: string): boolean {
  return pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
}

export interface CurrentNavigationEntry {
  group: AdminNavigationGroup;
  item: AdminNavigationItem;
}

/** The deepest navigation item whose route contains the current path. */
export function findCurrentEntry(
  groups: readonly AdminNavigationGroup[],
  pathname: string,
): CurrentNavigationEntry | undefined {
  let best: CurrentNavigationEntry | undefined;
  for (const group of groups) {
    for (const item of group.items) {
      if (item.to && matchesRoute(pathname, item.to)) {
        if (!best?.item.to || item.to.length > best.item.to.length) {
          best = { group, item };
        }
      }
    }
  }
  return best;
}

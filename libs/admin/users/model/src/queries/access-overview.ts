import { accessActions } from '../entities/access-rights';

import type { AccessAction, AccessArea, AccessGrants, AccessRole } from '../entities/access-rights';

/** Which pages the rights list shows: every page, the pages the role sees, or the unsaved changes. */
export type AccessPageFilter = 'all' | 'granted' | 'changed';

const pagesWord = (count: number): string => {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return 'сторінок';
  if (ones === 1) return 'сторінка';
  return ones >= 2 && ones <= 4 ? 'сторінки' : 'сторінок';
};

/** «1 сторінка», «3 сторінки», «12 сторінок». */
export const describePageCount = (count: number): string => `${count} ${pagesWord(count)}`;

export const countGrantedPages = (grants: AccessGrants, areas: readonly AccessArea[]): number =>
  areas.filter((area) => grants[area.key]?.includes('view')).length;

const actionsKey = (grants: AccessGrants, area: AccessArea): string => {
  const actions = grants[area.key] ?? [];
  if (!actions.includes('view')) return '';
  return accessActions
    .filter((action) => actions.includes(action) && area.actions.includes(action))
    .join(',');
};

/** Pages whose rights differ between the draft and the saved role, in menu order. */
export const changedAccessAreas = (
  draft: AccessGrants,
  saved: AccessGrants,
  areas: readonly AccessArea[],
): AccessArea[] => areas.filter((area) => actionsKey(draft, area) !== actionsKey(saved, area));

/** Every word of the search is found in the page title or its group, ignoring case. */
export const matchesAccessSearch = (area: AccessArea, search: string): boolean => {
  const words = search.toLocaleLowerCase('uk').split(/\s+/).filter(Boolean);
  const text = `${area.title} ${area.group}`.toLocaleLowerCase('uk');
  return words.every((word) => text.includes(word));
};

export const filterAccessAreas = (
  areas: readonly AccessArea[],
  options: {
    search: string;
    filter: AccessPageFilter;
    grants: AccessGrants;
    changed: ReadonlySet<string>;
  },
): AccessArea[] =>
  areas.filter((area) => {
    if (!matchesAccessSearch(area, options.search)) return false;
    if (options.filter === 'granted') return options.grants[area.key]?.includes('view') ?? false;
    if (options.filter === 'changed') return options.changed.has(area.key);
    return true;
  });

/** The second line of a role in the role list. */
export const describeRoleAccess = (
  role: AccessRole,
  grants: AccessGrants,
  areas: readonly AccessArea[],
): string => {
  if (role.locked) return 'усе, не змінюється';
  const pages = describePageCount(countGrantedPages(grants, areas));
  return role.builtIn ? pages : `власна роль · ${pages}`;
};

const letters: Readonly<Record<AccessAction, string>> = {
  view: 'П',
  create: 'С',
  edit: 'Р',
  delete: 'В',
};

/** A cell of «Порівняти ролі»: «П С Р В» for the actions held, «усе» for the director, «—» for none. */
export const accessCellOf = (role: AccessRole, area: AccessArea): string => {
  if (role.locked) return 'усе';
  const actions = role.grants[area.key] ?? [];
  if (!actions.includes('view')) return '—';
  return accessActions
    .filter((action) => actions.includes(action) && area.actions.includes(action))
    .map((action) => letters[action])
    .join(' ');
};

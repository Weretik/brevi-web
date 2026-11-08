import { accessActions } from '../entities/access-rights';

import type {
  AccessAction,
  AccessArea,
  AccessAreaGroup,
  AccessGrants,
} from '../entities/access-rights';

const sortActions = (actions: Iterable<AccessAction>): AccessAction[] => {
  const set = new Set(actions);
  return accessActions.filter((action) => set.has(action));
};

/**
 * Keeps only known pages and the actions each page has, in a stable order, and drops pages
 * without `view`; two equal grants then compare equal.
 */
export const normalizeAccessGrants = (
  grants: AccessGrants,
  areas: readonly AccessArea[],
): AccessGrants => {
  const result: Record<string, readonly AccessAction[]> = {};
  for (const area of areas) {
    const actions = sortActions(
      (grants[area.key] ?? []).filter((action) => area.actions.includes(action)),
    );
    if (actions.includes('view')) result[area.key] = actions;
  }
  return result;
};

export const hasAccessAction = (
  grants: AccessGrants,
  pageKey: string,
  action: AccessAction,
): boolean => grants[pageKey]?.includes(action) ?? false;

/** Turning «Бачить» on gives only `view`; turning it off removes every action of the page. */
export const setAccessView = (grants: AccessGrants, pageKey: string, on: boolean): AccessGrants => {
  if (on) return { ...grants, [pageKey]: ['view'] };
  return Object.fromEntries(Object.entries(grants).filter(([key]) => key !== pageKey));
};

/** Changes one action other than `view`; ignored while the role does not see the page. */
export const setAccessAction = (
  grants: AccessGrants,
  pageKey: string,
  action: Exclude<AccessAction, 'view'>,
  on: boolean,
): AccessGrants => {
  const current = grants[pageKey];
  if (!current?.includes('view')) return grants;
  const next = on ? [...current, action] : current.filter((item) => item !== action);
  return { ...grants, [pageKey]: sortActions(next) };
};

export const areAccessGrantsEqual = (
  left: AccessGrants,
  right: AccessGrants,
  areas: readonly AccessArea[],
): boolean => {
  const a = normalizeAccessGrants(left, areas);
  const b = normalizeAccessGrants(right, areas);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const x = a[key] ?? [];
    const y = b[key] ?? [];
    if (x.length !== y.length || x.some((action, index) => action !== y[index])) return false;
  }
  return true;
};

/** Groups pages by their menu group, keeping the server (menu) order of groups and pages. */
export const groupAccessAreas = (areas: readonly AccessArea[]): AccessAreaGroup[] => {
  const groups = new Map<string, AccessArea[]>();
  for (const area of areas) {
    const group = groups.get(area.group);
    if (group) group.push(area);
    else groups.set(area.group, [area]);
  }
  return [...groups].map(([title, groupAreas]) => ({ title, areas: groupAreas }));
};

/** «N з M сторінок» for a group card, or «немає доступу» when the role sees none of its pages. */
export const describeGroupAccess = (group: AccessAreaGroup, grants: AccessGrants): string => {
  const visible = group.areas.filter((area) => hasAccessAction(grants, area.key, 'view')).length;
  if (visible === 0) return 'немає доступу';
  const total = group.areas.length;
  return `${visible} з ${total} ${total === 1 ? 'сторінки' : 'сторінок'}`;
};

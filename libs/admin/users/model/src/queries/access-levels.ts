import { accessActions } from '../entities/access-rights';

import type {
  AccessAction,
  AccessArea,
  AccessAreaGroup,
  AccessGrants,
} from '../entities/access-rights';

/** One click of rights on a page: nothing, only seeing it, everyday work (create and edit), or everything. */
export type AccessLevel = 'none' | 'view' | 'work' | 'all';

/** The page's rights match no level: some actions were picked one by one. */
export type AccessLevelState = AccessLevel | 'custom';

/** A group's rights at once; `mixed` when its pages differ. */
export type GroupAccessLevel = 'none' | 'view' | 'all' | 'mixed';

export const accessLevelLabels: Readonly<Record<AccessLevel, string>> = {
  none: 'Немає',
  view: 'Перегляд',
  work: 'Робота',
  all: 'Усе',
};

const workActions: readonly AccessAction[] = ['view', 'create', 'edit'];

/** Levels a page offers: «Робота» only with create or edit, «Усе» only when it also deletes. */
export const accessLevelsOf = (area: AccessArea): AccessLevel[] => {
  const levels: AccessLevel[] = ['none', 'view'];
  if (area.actions.includes('create') || area.actions.includes('edit')) levels.push('work');
  if (area.actions.includes('delete')) levels.push('all');
  return levels;
};

export const accessActionsOfLevel = (area: AccessArea, level: AccessLevel): AccessAction[] => {
  if (level === 'none') return [];
  if (level === 'view') return ['view'];
  const allowed = level === 'work' ? workActions : accessActions;
  return accessActions.filter(
    (action) => allowed.includes(action) && area.actions.includes(action),
  );
};

const sameActions = (left: readonly AccessAction[], right: readonly AccessAction[]): boolean =>
  left.length === right.length && left.every((action) => right.includes(action));

const actionsOf = (grants: AccessGrants, area: AccessArea): AccessAction[] => {
  const actions = (grants[area.key] ?? []).filter((action) => area.actions.includes(action));
  return actions.includes('view') ? actions : [];
};

/** The level the page's rights match, or `custom`. */
export const accessLevelOf = (area: AccessArea, grants: AccessGrants): AccessLevelState => {
  const current = actionsOf(grants, area);
  return (
    accessLevelsOf(area).find((level) => sameActions(accessActionsOfLevel(area, level), current)) ??
    'custom'
  );
};

const withActions = (
  grants: AccessGrants,
  key: string,
  actions: readonly AccessAction[],
): AccessGrants => {
  const rest = Object.fromEntries(Object.entries(grants).filter(([page]) => page !== key));
  return actions.length === 0 ? rest : { ...rest, [key]: actions };
};

export const setAccessLevel = (
  grants: AccessGrants,
  area: AccessArea,
  level: AccessLevel,
): AccessGrants => withActions(grants, area.key, accessActionsOfLevel(area, level));

/** «Немає», «Перегляд» or «Усе» for every page of a group. */
export const setGroupAccessLevel = (
  grants: AccessGrants,
  group: AccessAreaGroup,
  level: Exclude<GroupAccessLevel, 'mixed'>,
): AccessGrants =>
  group.areas.reduce(
    (current, area) =>
      withActions(
        current,
        area.key,
        level === 'all' ? [...area.actions] : accessActionsOfLevel(area, level),
      ),
    grants,
  );

export const groupAccessLevelOf = (
  group: AccessAreaGroup,
  grants: AccessGrants,
): GroupAccessLevel => {
  const held = group.areas.map((area) => ({ area, actions: actionsOf(grants, area) }));
  if (held.every(({ actions }) => actions.length === 0)) return 'none';
  if (held.every(({ area, actions }) => sameActions(actions, area.actions))) return 'all';
  if (held.every(({ actions }) => sameActions(actions, ['view']))) return 'view';
  return 'mixed';
};

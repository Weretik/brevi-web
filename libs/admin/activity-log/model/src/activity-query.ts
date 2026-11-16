import type { ActivityQuery } from './activity-entry';

/** R-01: one page holds 50 entries. */
export const activityPageSize = 50;

/** R-02: the page shows managers until «Усі ролі» is chosen. */
export const defaultActivityRole = 'Manager';

/** The URL value of «Усі ролі». */
export const allActivityRoles = 'all';

const date = /^\d{4}-\d{2}-\d{2}$/;

function positive(value: string | null): number | undefined {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function text(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function day(value: string | null): string | undefined {
  return value && date.test(value) ? value : undefined;
}

/** The request the URL describes (R-02); unknown or broken values are ignored. */
export function activityQueryFromParams(params: URLSearchParams): ActivityQuery {
  const role = text(params.get('role')) ?? defaultActivityRole;
  return {
    page: positive(params.get('page')) ?? 1,
    pageSize: activityPageSize,
    actorId: positive(params.get('actor')),
    role: role === allActivityRoles ? undefined : role,
    subjectType: text(params.get('type')),
    action: text(params.get('action')),
    from: day(params.get('from')),
    to: day(params.get('to')),
    search: text(params.get('q')),
  };
}

/** The URL of a request: defaults are left out, «Усі ролі» is `role=all`. */
export function activityQueryToParams(query: ActivityQuery): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  };
  set(
    'role',
    query.role === undefined
      ? allActivityRoles
      : query.role === defaultActivityRole
        ? undefined
        : query.role,
  );
  set('actor', query.actorId);
  set('type', query.subjectType);
  set('action', query.action);
  set('from', query.from);
  set('to', query.to);
  set('q', query.search);
  set('page', query.page > 1 ? query.page : undefined);
  return params;
}

/** True when anything narrows the list besides the default role. */
export function activityQueryIsFiltered(query: ActivityQuery): boolean {
  return (
    query.role !== defaultActivityRole ||
    [query.actorId, query.subjectType, query.action, query.from, query.to, query.search].some(
      (value) => value !== undefined,
    )
  );
}

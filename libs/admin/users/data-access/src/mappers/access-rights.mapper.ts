import { accessActions } from '@admin/users/model';

import type { components } from '@admin/shared/contracts';
import type {
  AccessAction,
  AccessArea,
  AccessGrants,
  AccessRights,
  AccessRole,
} from '@admin/users/model';

type AccessRoleResponse = components['schemas']['AccessRoleResponse'];
type AccessAreaResponse = components['schemas']['AccessAreaResponse'];
type SaveRoleAccessBody = components['schemas']['SaveRoleAccessRequest'];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isAction = (value: unknown): value is AccessAction =>
  typeof value === 'string' && (accessActions as readonly string[]).includes(value);

const isActions = (value: unknown): value is AccessAction[] =>
  Array.isArray(value) && value.every(isAction);

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

const mapGrants = (value: unknown): AccessGrants => {
  if (!isObject(value)) throw new Error('Некоректні права ролі.');
  const grants: Record<string, AccessAction[]> = {};
  for (const [key, actions] of Object.entries(value)) {
    if (!isActions(actions)) throw new Error('Некоректні права ролі.');
    grants[key] = [...actions];
  }
  return grants;
};

const mapArea = (value: unknown): AccessArea => {
  const area = value as Partial<AccessAreaResponse> | null;
  if (
    !isObject(area) ||
    typeof area.key !== 'string' ||
    typeof area.group !== 'string' ||
    typeof area.title !== 'string' ||
    !isActions(area.actions)
  ) {
    throw new Error('Некоректна сторінка в правах доступу.');
  }
  return { key: area.key, group: area.group, title: area.title, actions: [...area.actions] };
};

/** Checks one role of GET /api/admin/access or the role returned after a save. */
export const mapAccessRole = (value: unknown): AccessRole => {
  const role = value as Partial<AccessRoleResponse> | null;
  if (
    !isObject(role) ||
    typeof role.name !== 'string' ||
    typeof role.title !== 'string' ||
    typeof role.locked !== 'boolean' ||
    typeof role.builtIn !== 'boolean' ||
    typeof role.userCount !== 'number' ||
    typeof role.version !== 'number' ||
    !isNullableString(role.updatedByName ?? null) ||
    !isNullableString(role.updatedAt ?? null)
  ) {
    throw new Error('Некоректна роль.');
  }
  return {
    name: role.name,
    title: role.title,
    locked: role.locked,
    builtIn: role.builtIn,
    userCount: role.userCount,
    version: role.version,
    updatedByName: role.updatedByName ?? null,
    updatedAt: role.updatedAt ?? null,
    grants: mapGrants(role.grants ?? {}),
  };
};

/** Checks GET /api/admin/access before the page uses it; areas stay in menu order. */
export const mapAccessRights = (value: unknown): AccessRights => {
  if (!isObject(value) || !Array.isArray(value['areas']) || !Array.isArray(value['roles'])) {
    throw new Error('Некоректна відповідь про права доступу.');
  }
  return { areas: value['areas'].map(mapArea), roles: value['roles'].map(mapAccessRole) };
};

/** The new role after POST; only its name and title are needed to open its tab. */
export const mapCreatedRole = (value: unknown): { name: string; title: string } => {
  if (!isObject(value) || typeof value['name'] !== 'string' || typeof value['title'] !== 'string') {
    throw new Error('Некоректна відповідь про нову роль.');
  }
  return { name: value['name'], title: value['title'] };
};

export const toSaveRoleAccessBody = (
  version: number,
  grants: AccessGrants,
): SaveRoleAccessBody => ({
  version,
  grants: Object.fromEntries(Object.entries(grants).map(([key, actions]) => [key, [...actions]])),
});

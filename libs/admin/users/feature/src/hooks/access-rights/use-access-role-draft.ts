import {
  areAccessGrantsEqual,
  normalizeAccessGrants,
  setAccessAction,
  setAccessView,
} from '@admin/users/model';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { AccessAction, AccessArea, AccessGrants, AccessRole } from '@admin/users/model';

interface RoleDraft {
  role: string;
  grants: AccessGrants;
}

interface Options {
  roles: readonly AccessRole[];
  areas: readonly AccessArea[];
  /** Called whenever another role tab opens, for example to clear a save error. */
  onTabChange?: () => void;
}

const tabParam = 'role';

/**
 * «Права доступу»: the role tab kept in the URL, the unsaved switches of that role, and the
 * question before a changed role is left.
 */
export function useAccessRoleDraft({ roles, areas, onTabChange }: Options) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRole = searchParams.get(tabParam);
  const selectedRole =
    roles.find((role) => role.name === requestedRole) ??
    roles.find((role) => !role.locked) ??
    roles[0] ??
    null;

  const [draft, setDraft] = useState<RoleDraft | null>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const savedGrants = useMemo(
    () => (selectedRole ? normalizeAccessGrants(selectedRole.grants, areas) : {}),
    [selectedRole, areas],
  );
  const grants =
    draft && selectedRole && draft.role === selectedRole.name ? draft.grants : savedGrants;
  const dirty = Boolean(selectedRole) && !areAccessGrantsEqual(grants, savedGrants, areas);

  const selectTab = (roleName: string) => {
    setDraft(null);
    setPendingTab(null);
    onTabChange?.();
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set(tabParam, roleName);
        return next;
      },
      { replace: true },
    );
  };

  const requestTab = (roleName: string) => {
    if (roleName === selectedRole?.name) return;
    if (dirty) setPendingTab(roleName);
    else selectTab(roleName);
  };

  const changeGrants = (change: (current: AccessGrants) => AccessGrants) => {
    if (!selectedRole) return;
    setDraft({ role: selectedRole.name, grants: change(grants) });
  };

  return {
    selectedRole,
    grants,
    dirty,
    pendingTab,
    selectTab,
    requestTab,
    confirmPendingTab: () => {
      if (pendingTab) selectTab(pendingTab);
    },
    cancelPendingTab: () => setPendingTab(null),
    discardDraft: () => setDraft(null),
    changeView: (pageKey: string, on: boolean) =>
      changeGrants((current) => setAccessView(current, pageKey, on)),
    changeAction: (pageKey: string, action: Exclude<AccessAction, 'view'>, on: boolean) =>
      changeGrants((current) => setAccessAction(current, pageKey, action, on)),
  };
}

import { useGetAccessRightsQuery } from '@admin/users/data-access';
import { groupAccessAreas, normalizeAccessGrants } from '@admin/users/model';
import { AccessAdminOnlyCard, AccessRightsHeader } from '@admin/users/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { AccessRightsDialogs } from '../components/access-rights-dialogs';
import { AccessRightsPanels } from '../components/access-rights-panels';
import { AccessRightsUnavailable } from '../components/access-rights-unavailable';
import { AccessRightsWorkspace } from '../components/access-rights-workspace';
import { useAccessListView } from '../hooks/access/use-access-list-view';
import { useAccessRightsActions } from '../hooks/access/use-access-rights-actions';
import { useAccessRoleDraft } from '../hooks/access/use-access-role-draft';

import type { AccessPanel } from '../components/access-rights-panels';
import type { AccessRole } from '@admin/users/model';

interface AccessRightsPageProps {
  /** Re-reads the session after a change, so the signed-in user's menu follows the new rights. */
  onAccessChanged: () => Promise<void>;
}

/** «Адміністрування › Права доступу»: roles on the left, the selected role's rights on the right (ACC-002). */
export default function AccessRightsPage({ onAccessChanged }: AccessRightsPageProps) {
  const rightsQuery = useGetAccessRightsQuery();
  const rights = rightsQuery.currentData ?? rightsQuery.data;
  const areas = useMemo(() => rights?.areas ?? [], [rights]);
  const roles = useMemo(() => rights?.roles ?? [], [rights]);
  const groups = useMemo(() => groupAccessAreas(areas), [areas]);

  const [panel, setPanel] = useState<AccessPanel>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccessRole | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const actions = useAccessRightsActions({ onAccessChanged, onSuccess: setSuccessMessage });
  const draft = useAccessRoleDraft({ roles, areas, onTabChange: actions.clearSaveError });
  const list = useAccessListView({
    areas,
    groups,
    grants: draft.grants,
    changed: draft.changedKeys,
  });
  const { selectedRole } = draft;

  const handleSave = async () => {
    if (!selectedRole || !draft.dirty) return;
    const saved = await actions.save(selectedRole, normalizeAccessGrants(draft.grants, areas));
    if (saved) draft.discardDraft();
  };

  const handleReload = () => {
    draft.discardDraft();
    actions.clearSaveError();
    void rightsQuery.refetch();
  };

  const handleCreate = async (title: string): Promise<boolean> => {
    const name = await actions.create(title);
    if (!name) return false;
    list.stopComparing();
    draft.selectTab(name);
    return true;
  };

  const handleDelete = async () => {
    if (!deleteTarget || !(await actions.remove(deleteTarget))) return;
    setDeleteTarget(null);
    const next = roles.find((item) => !item.locked && item.name !== deleteTarget.name);
    if (next) draft.selectTab(next.name);
  };

  const openPanel = (next: Exclude<AccessPanel, null>) => {
    actions.clearCreateError();
    actions.clearRenameError();
    setPanel(next);
  };

  const header = (
    <AccessRightsHeader loaded={Boolean(rights)} onNewRole={() => openPanel('create')} />
  );

  if (!rights) {
    return (
      <Stack component="section" spacing={3}>
        {header}
        <AccessRightsUnavailable
          error={rightsQuery.error}
          isError={rightsQuery.isError}
          onRetry={() => void rightsQuery.refetch()}
        />
      </Stack>
    );
  }

  return (
    <Stack component="section" spacing={3}>
      {header}
      {rightsQuery.isError ? (
        <Alert
          action={<Button onClick={() => void rightsQuery.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося оновити права доступу.
        </Alert>
      ) : null}
      <AccessRightsWorkspace
        actions={actions}
        areas={areas}
        draft={draft}
        groups={groups}
        list={list}
        onCopy={() => openPanel('copy')}
        onDelete={() => {
          actions.clearDeleteError();
          setDeleteTarget(selectedRole);
        }}
        onReload={handleReload}
        onRename={() => openPanel('rename')}
        onSave={() => void handleSave()}
        roles={roles}
      />
      <AccessAdminOnlyCard items={rights.adminOnly} />
      <AccessRightsPanels
        actions={actions}
        draft={draft}
        onClose={() => setPanel(null)}
        onCreate={handleCreate}
        panel={panel}
        roles={roles}
      />
      <AccessRightsDialogs
        actions={actions}
        deleteTarget={deleteTarget}
        onCancelDelete={() => setDeleteTarget(null)}
        onCloseSuccess={() => setSuccessMessage(null)}
        onDelete={() => void handleDelete()}
        role={draft}
        successMessage={successMessage}
      />
    </Stack>
  );
}

import { useGetAccessRightsQuery } from '@admin/users/data-access';
import { groupAccessAreas, normalizeAccessGrants } from '@admin/users/model';
import { AccessRightsHeader, AccessRolePanel, AccessRoleTabs, NewRolePanel } from '@admin/users/ui';
import { Alert, Box, Button, Card, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { AccessRightsDialogs } from '../components/access-rights-dialogs';
import { AccessRightsUnavailable } from '../components/access-rights-unavailable';
import { useAccessRightsActions } from '../hooks/use-access-rights-actions';
import { useAccessRoleDraft } from '../hooks/use-access-role-draft';

import type { AccessRole } from '@admin/users/model';

interface AccessRightsPageProps {
  /** Re-reads the session after a change, so the signed-in user's menu follows the new rights. */
  onAccessChanged: () => Promise<void>;
}

export default function AccessRightsPage({ onAccessChanged }: AccessRightsPageProps) {
  const rightsQuery = useGetAccessRightsQuery();
  const rights = rightsQuery.currentData ?? rightsQuery.data;
  const areas = useMemo(() => rights?.areas ?? [], [rights]);
  const roles = useMemo(() => rights?.roles ?? [], [rights]);
  const groups = useMemo(() => groupAccessAreas(areas), [areas]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AccessRole | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const actions = useAccessRightsActions({ onAccessChanged, onSuccess: setSuccessMessage });
  const role = useAccessRoleDraft({ roles, areas, onTabChange: actions.clearSaveError });
  const { selectedRole, grants, dirty } = role;
  const editable = Boolean(selectedRole) && !selectedRole?.locked && !actions.saving;

  const handleSave = async () => {
    if (!selectedRole || !dirty) return;
    if (await actions.save(selectedRole, normalizeAccessGrants(grants, areas))) role.discardDraft();
  };

  const handleReload = () => {
    role.discardDraft();
    actions.clearSaveError();
    void rightsQuery.refetch();
  };

  const handleCreate = async (title: string): Promise<boolean> => {
    const name = await actions.create(title);
    if (!name) return false;
    role.selectTab(name);
    return true;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (await actions.remove(deleteTarget)) {
      setDeleteTarget(null);
      const next = roles.find((item) => !item.locked && item.name !== deleteTarget.name);
      if (next) role.selectTab(next.name);
    }
  };

  const header = (
    <AccessRightsHeader
      canSave={Boolean(selectedRole && !selectedRole.locked)}
      dirty={dirty}
      loaded={Boolean(rights)}
      onNewRole={() => {
        actions.clearCreateError();
        setIsCreateOpen(true);
      }}
      onSave={() => void handleSave()}
      saving={actions.saving}
    />
  );

  if (!rights) {
    return (
      <Stack component="section" spacing={3}>
        {header}
        <AccessRightsUnavailable
          isError={rightsQuery.isError}
          error={rightsQuery.error}
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
      {roles.length === 0 ? (
        <Card sx={{ p: 3 }} variant="outlined">
          <Typography color="text.secondary" variant="body2">
            Ролей ще немає.
          </Typography>
        </Card>
      ) : (
        <Box>
          <AccessRoleTabs
            onSelect={role.requestTab}
            roles={roles}
            selected={selectedRole?.name ?? ''}
          />
          {selectedRole ? (
            <AccessRolePanel
              editable={editable}
              grants={grants}
              groups={groups}
              onActionChange={role.changeAction}
              onClearSaveError={actions.clearSaveError}
              onDelete={() => {
                actions.clearDeleteError();
                setDeleteTarget(selectedRole);
              }}
              onReload={handleReload}
              onViewChange={role.changeView}
              role={selectedRole}
              saveError={actions.saveError}
            />
          ) : null}
        </Box>
      )}
      <NewRolePanel
        error={actions.createError}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        open={isCreateOpen}
        submitting={actions.creating}
      />
      <AccessRightsDialogs
        actions={actions}
        role={role}
        deleteTarget={deleteTarget}
        onCancelDelete={() => setDeleteTarget(null)}
        onDelete={() => void handleDelete()}
        successMessage={successMessage}
        onCloseSuccess={() => setSuccessMessage(null)}
      />
    </Stack>
  );
}

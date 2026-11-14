import { useGetAccessRightsQuery } from '@admin/users/data-access';
import { groupAccessAreas, normalizeAccessGrants } from '@admin/users/model';
import {
  AccessRightsHeader,
  AccessRolePanel,
  AccessRoleTabs,
  ConfirmActionDialog,
  NewRolePanel,
} from '@admin/users/ui';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { isForbiddenError } from '../../errors/access-error-message';
import { useAccessRoleDraft } from '../../hooks/access-rights/use-access-role-draft';
import { useAccessRightsActions } from '../../hooks/use-access-rights-actions';

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
    if (await actions.save(selectedRole, normalizeAccessGrants(grants, areas)))
      role.discardDraft();
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
        {rightsQuery.isError ? (
          isForbiddenError(rightsQuery.error) ? (
            <Alert severity="warning">Лише адміністратор може керувати правами доступу.</Alert>
          ) : (
            <Alert
              action={<Button onClick={() => void rightsQuery.refetch()}>Повторити</Button>}
              severity="error"
            >
              Не вдалося завантажити права доступу.
            </Alert>
          )
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress aria-label="Завантаження прав доступу" />
          </Box>
        )}
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
      <ConfirmActionDialog
        confirmLabel="Видалити роль"
        description={`Роль «${deleteTarget?.title ?? ''}» буде видалено разом з її правами. Цю дію не можна скасувати.`}
        destructive
        error={actions.deleteError}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        open={deleteTarget !== null}
        submitting={actions.deleting}
        title="Видалити роль?"
      />
      <ConfirmActionDialog
        confirmLabel="Перейти без збереження"
        description="На цій вкладці є незбережені зміни. Якщо перейти до іншої ролі, вони зникнуть."
        destructive
        error={null}
        onCancel={role.cancelPendingTab}
        onConfirm={role.confirmPendingTab}
        open={role.pendingTab !== null}
        submitting={false}
        title="Незбережені зміни"
      />
      <Snackbar
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        open={successMessage !== null}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

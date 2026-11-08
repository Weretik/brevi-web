import { useGetAccessRightsQuery } from '@admin/users/data-access';
import {
  areAccessGrantsEqual,
  groupAccessAreas,
  normalizeAccessGrants,
  setAccessAction,
  setAccessView,
} from '@admin/users/model';
import {
  AccessGroupCard,
  AccessRoleTabs,
  ConfirmActionDialog,
  NewRolePanel,
} from '@admin/users/ui';
import AddIcon from '@mui/icons-material/Add';
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
import { useSearchParams } from 'react-router-dom';

import { isForbiddenError } from '../errors/access-error-message';
import { useAccessRightsActions } from '../hooks/use-access-rights-actions';

import type { AccessAction, AccessGrants, AccessRole } from '@admin/users/model';

interface AccessRightsPageProps {
  /** Re-reads the session after a change, so the signed-in user's menu follows the new rights. */
  onAccessChanged: () => Promise<void>;
}

interface RoleDraft {
  role: string;
  grants: AccessGrants;
}

const tabParam = 'role';

const savedAtFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

const formatSavedAt = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : savedAtFormat.format(date);
};

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

export default function AccessRightsPage({ onAccessChanged }: AccessRightsPageProps) {
  const rightsQuery = useGetAccessRightsQuery();
  const rights = rightsQuery.currentData ?? rightsQuery.data;
  const areas = useMemo(() => rights?.areas ?? [], [rights]);
  const roles = useMemo(() => rights?.roles ?? [], [rights]);
  const groups = useMemo(() => groupAccessAreas(areas), [areas]);

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRole = searchParams.get(tabParam);
  const selectedRole =
    roles.find((role) => role.name === requestedRole) ??
    roles.find((role) => !role.locked) ??
    roles[0] ??
    null;

  const [draft, setDraft] = useState<RoleDraft | null>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AccessRole | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const actions = useAccessRightsActions({ onAccessChanged, onSuccess: setSuccessMessage });

  const savedGrants = useMemo(
    () => (selectedRole ? normalizeAccessGrants(selectedRole.grants, areas) : {}),
    [selectedRole, areas],
  );
  const grants =
    draft && selectedRole && draft.role === selectedRole.name ? draft.grants : savedGrants;
  const dirty = Boolean(selectedRole) && !areAccessGrantsEqual(grants, savedGrants, areas);
  const editable = Boolean(selectedRole) && !selectedRole?.locked && !actions.saving;

  const selectTab = (roleName: string) => {
    setDraft(null);
    setPendingTab(null);
    actions.clearSaveError();
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

  const handleViewChange = (pageKey: string, on: boolean) =>
    changeGrants((current) => setAccessView(current, pageKey, on));

  const handleActionChange = (
    pageKey: string,
    action: Exclude<AccessAction, 'view'>,
    on: boolean,
  ) => changeGrants((current) => setAccessAction(current, pageKey, action, on));

  const handleSave = async () => {
    if (!selectedRole || !dirty) return;
    if (await actions.save(selectedRole, normalizeAccessGrants(grants, areas))) setDraft(null);
  };

  const handleReload = () => {
    setDraft(null);
    actions.clearSaveError();
    void rightsQuery.refetch();
  };

  const handleCreate = async (title: string): Promise<boolean> => {
    const name = await actions.create(title);
    if (!name) return false;
    selectTab(name);
    return true;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (await actions.remove(deleteTarget)) {
      setDeleteTarget(null);
      const next = roles.find((role) => !role.locked && role.name !== deleteTarget.name);
      if (next) selectTab(next.name);
    }
  };

  const header = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ alignItems: { sm: 'flex-end' }, gap: 2, justifyContent: 'space-between' }}
    >
      <div>
        <Typography component="h1" variant="h4">
          Права доступу
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }} variant="body2">
          Виберіть роль і позначте, що вона бачить і що може. Директор завжди має всі права.
        </Typography>
      </div>
      {rights ? (
        <Stack direction="row" sx={{ flexShrink: 0, gap: 1 }}>
          <Button
            onClick={() => {
              actions.clearCreateError();
              setIsCreateOpen(true);
            }}
            startIcon={<AddIcon />}
            variant="outlined"
          >
            Нова роль
          </Button>
          {selectedRole && !selectedRole.locked ? (
            <Button
              disabled={!dirty || actions.saving}
              onClick={() => void handleSave()}
              variant="contained"
            >
              {actions.saving && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
              Зберегти
            </Button>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
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

  const deleteBlocked = Boolean(selectedRole && selectedRole.userCount > 0);

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
          <AccessRoleTabs onSelect={requestTab} roles={roles} selected={selectedRole?.name ?? ''} />
          {selectedRole ? (
            <Stack
              aria-labelledby={`access-role-tab-${selectedRole.name}`}
              role="tabpanel"
              spacing={2}
              sx={{ pt: 2 }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ alignItems: { sm: 'center' }, gap: 1, justifyContent: 'space-between' }}
              >
                <Typography sx={{ color: 'text.secondary' }} variant="body2">
                  Користувачів з цією роллю:{' '}
                  <Box component="span" sx={mono}>
                    {selectedRole.userCount}
                  </Box>
                  {selectedRole.updatedAt ? (
                    <>
                      {' · '}Останні зміни:{' '}
                      {selectedRole.updatedByName ? `${selectedRole.updatedByName}, ` : ''}
                      <Box component="span" sx={mono}>
                        {formatSavedAt(selectedRole.updatedAt)}
                      </Box>
                    </>
                  ) : null}
                </Typography>
                {!selectedRole.builtIn && !selectedRole.locked ? (
                  <Stack sx={{ alignItems: { sm: 'flex-end' }, gap: 0.5 }}>
                    <Button
                      color="error"
                      disabled={deleteBlocked}
                      onClick={() => {
                        actions.clearDeleteError();
                        setDeleteTarget(selectedRole);
                      }}
                      size="small"
                      variant="outlined"
                    >
                      Видалити роль
                    </Button>
                    {deleteBlocked ? (
                      <Typography sx={{ color: 'text.secondary' }} variant="caption">
                        Спершу змініть роль у{' '}
                        <Box component="span" sx={mono}>
                          {selectedRole.userCount}
                        </Box>{' '}
                        {selectedRole.userCount === 1 ? 'користувача' : 'користувачів'}
                      </Typography>
                    ) : null}
                  </Stack>
                ) : null}
              </Stack>
              {actions.saveError ? (
                <Alert
                  action={
                    actions.saveError.conflict ? (
                      <Button color="inherit" onClick={handleReload} size="small">
                        Перезавантажити
                      </Button>
                    ) : undefined
                  }
                  onClose={actions.saveError.conflict ? undefined : actions.clearSaveError}
                  severity="error"
                >
                  {actions.saveError.message}
                </Alert>
              ) : null}
              {selectedRole.locked ? (
                <Alert severity="info">
                  {selectedRole.title} — усі права, не змінюється. Директор бачить кожну сторінку й
                  може все, зокрема сторінки, додані пізніше.
                </Alert>
              ) : groups.length === 0 ? (
                <Card sx={{ p: 3 }} variant="outlined">
                  <Typography color="text.secondary" variant="body2">
                    Сторінок, до яких можна дати доступ, ще немає.
                  </Typography>
                </Card>
              ) : (
                <Box
                  sx={{
                    alignItems: 'start',
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
                  }}
                >
                  {groups.map((group) => (
                    <AccessGroupCard
                      disabled={!editable}
                      grants={grants}
                      group={group}
                      key={group.title}
                      onActionChange={handleActionChange}
                      onViewChange={handleViewChange}
                    />
                  ))}
                </Box>
              )}
            </Stack>
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
        onCancel={() => setPendingTab(null)}
        onConfirm={() => {
          if (pendingTab) selectTab(pendingTab);
        }}
        open={pendingTab !== null}
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

import { Alert, Box, Button, Card, Stack, Typography } from '@mui/material';

import { AccessGroupCard } from '../../components/access-rights/access-group-card';

import type { AccessAction, AccessAreaGroup, AccessGrants, AccessRole } from '@admin/users/model';

interface AccessRolePanelProps {
  role: AccessRole;
  groups: readonly AccessAreaGroup[];
  grants: AccessGrants;
  /** False while saving, for the director, or without the right to change. */
  editable: boolean;
  /** The last save failed; `conflict` means someone else saved the role first. */
  saveError: { message: string; conflict: boolean } | null;
  onDelete: () => void;
  onReload: () => void;
  onClearSaveError: () => void;
  onViewChange: (pageKey: string, on: boolean) => void;
  onActionChange: (pageKey: string, action: Exclude<AccessAction, 'view'>, on: boolean) => void;
}

const savedAtFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

const formatSavedAt = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : savedAtFormat.format(date);
};

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** «Права доступу»: one role tab — who holds it, deleting it, and its page switches. */
export function AccessRolePanel({
  role,
  groups,
  grants,
  editable,
  saveError,
  onDelete,
  onReload,
  onClearSaveError,
  onViewChange,
  onActionChange,
}: AccessRolePanelProps) {
  const deleteBlocked = role.userCount > 0;

  return (
    <Stack
      aria-labelledby={`access-role-tab-${role.name}`}
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
            {role.userCount}
          </Box>
          {role.updatedAt ? (
            <>
              {' · '}Останні зміни: {role.updatedByName ? `${role.updatedByName}, ` : ''}
              <Box component="span" sx={mono}>
                {formatSavedAt(role.updatedAt)}
              </Box>
            </>
          ) : null}
        </Typography>
        {!role.builtIn && !role.locked ? (
          <Stack sx={{ alignItems: { sm: 'flex-end' }, gap: 0.5 }}>
            <Button
              color="error"
              disabled={deleteBlocked}
              onClick={onDelete}
              size="small"
              variant="outlined"
            >
              Видалити роль
            </Button>
            {deleteBlocked ? (
              <Typography sx={{ color: 'text.secondary' }} variant="caption">
                Спершу змініть роль у{' '}
                <Box component="span" sx={mono}>
                  {role.userCount}
                </Box>{' '}
                {role.userCount === 1 ? 'користувача' : 'користувачів'}
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
      {saveError ? (
        <Alert
          action={
            saveError.conflict ? (
              <Button color="inherit" onClick={onReload} size="small">
                Перезавантажити
              </Button>
            ) : undefined
          }
          onClose={saveError.conflict ? undefined : onClearSaveError}
          severity="error"
        >
          {saveError.message}
        </Alert>
      ) : null}
      {role.locked ? (
        <Alert severity="info">
          {role.title} — усі права, не змінюється. Директор бачить кожну сторінку й може все,
          зокрема сторінки, додані пізніше.
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
              onActionChange={onActionChange}
              onViewChange={onViewChange}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
}

import { Box, Button, Stack, Typography } from '@mui/material';

import type { AccessRole } from '@admin/users/model';

interface AccessRoleHeaderProps {
  role: AccessRole;
  /** False while saving: copying would replace switches mid-save. */
  editable: boolean;
  onCopy: () => void;
  onRename: () => void;
  onDelete: () => void;
}

const savedAtFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

const formatSavedAt = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : savedAtFormat.format(date);
};

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** The selected role: who holds it, who changed it last, and copy, rename, delete. */
export function AccessRoleHeader({
  editable,
  onCopy,
  onDelete,
  onRename,
  role,
}: AccessRoleHeaderProps) {
  const custom = !role.builtIn && !role.locked;
  const deleteBlocked = role.userCount > 0;

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ alignItems: { md: 'flex-start' }, gap: 1.5, justifyContent: 'space-between' }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h2" variant="h5">
          {role.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }} variant="body2">
          {role.userNames.length > 0
            ? role.userNames.join(', ')
            : 'Немає користувачів з цією роллю'}
          {role.updatedAt ? (
            <>
              {' · '}останні зміни: {role.updatedByName ? `${role.updatedByName}, ` : ''}
              <Box component="span" sx={mono}>
                {formatSavedAt(role.updatedAt)}
              </Box>
            </>
          ) : null}
        </Typography>
      </Box>
      {role.locked ? null : (
        <Stack sx={{ alignItems: { md: 'flex-end' }, gap: 0.5 }}>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Button disabled={!editable} onClick={onCopy} size="small" variant="outlined">
              Копіювати з ролі…
            </Button>
            {custom ? (
              <Button disabled={!editable} onClick={onRename} size="small" variant="outlined">
                Перейменувати
              </Button>
            ) : null}
            {custom ? (
              <Button
                color="error"
                disabled={deleteBlocked}
                onClick={onDelete}
                size="small"
                variant="outlined"
              >
                Видалити роль
              </Button>
            ) : null}
          </Stack>
          {custom && deleteBlocked ? (
            <Typography sx={{ color: 'text.secondary' }} variant="caption">
              Щоб видалити роль, спершу змініть її у{' '}
              <Box component="span" sx={mono}>
                {role.userCount}
              </Box>{' '}
              {role.userCount === 1 ? 'користувача' : 'користувачів'}
            </Typography>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
}

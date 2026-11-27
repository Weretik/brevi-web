import { ReferenceSearchBar } from '@admin/references/ui';
import {
  AccessCompareTable,
  AccessRoleList,
  AccessRolePanel,
  AccessSaveBar,
} from '@admin/users/ui';
import { Box, Card, Stack, Typography } from '@mui/material';

import type { useAccessListView } from '../hooks/access/use-access-list-view';
import type { useAccessRightsActions } from '../hooks/access/use-access-rights-actions';
import type { useAccessRoleDraft } from '../hooks/access/use-access-role-draft';
import type { AccessArea, AccessAreaGroup, AccessRole } from '@admin/users/model';

interface Props {
  roles: readonly AccessRole[];
  areas: readonly AccessArea[];
  groups: readonly AccessAreaGroup[];
  draft: ReturnType<typeof useAccessRoleDraft>;
  list: ReturnType<typeof useAccessListView>;
  actions: ReturnType<typeof useAccessRightsActions>;
  onCopy: () => void;
  onRename: () => void;
  onDelete: () => void;
  onReload: () => void;
  onSave: () => void;
}

/**
 * Roles on the left; on the right the selected role's rights, or «Порівняти ролі» for every role; the save bar
 * sticks to the bottom while the role has unsaved changes.
 */
export function AccessRightsWorkspace({
  actions,
  areas,
  draft,
  groups,
  list,
  roles,
  ...props
}: Props) {
  const role = draft.selectedRole;
  const editable = Boolean(role) && !role?.locked && !actions.saving;

  if (roles.length === 0) {
    return (
      <Card sx={{ p: 3 }} variant="outlined">
        <Typography color="text.secondary" variant="body2">
          Ролей ще немає.
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '280px minmax(0, 1fr)' },
        }}
      >
        <Box sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
          <AccessRoleList
            areas={areas}
            comparing={list.comparing}
            dirty={draft.dirty}
            draft={draft.grants}
            onCompare={list.toggleComparing}
            onSelect={(name) => {
              list.stopComparing();
              draft.requestTab(name);
            }}
            roles={roles}
            selected={role?.name ?? ''}
          />
        </Box>
        {list.comparing ? (
          <Stack spacing={1}>
            <ReferenceSearchBar
              label="Пошук сторінки"
              onChange={list.view.onSearchChange}
              placeholder="Знайти сторінку: «склад», «КП»…"
              value={list.view.search}
            />
            <AccessCompareTable groups={list.searchedGroups} roles={roles} />
          </Stack>
        ) : role ? (
          <AccessRolePanel
            changed={draft.changedKeys}
            editable={editable}
            editing={{
              onActionChange: draft.changeAction,
              onGroupLevelChange: draft.changeGroupLevel,
              onLevelChange: draft.changeLevel,
            }}
            grants={draft.grants}
            groups={groups}
            onClearSaveError={actions.clearSaveError}
            onCopy={props.onCopy}
            onDelete={props.onDelete}
            onReload={props.onReload}
            onRename={props.onRename}
            role={role}
            saveError={actions.saveError}
            view={list.view}
          />
        ) : null}
      </Box>
      {role && draft.dirty && !list.comparing ? (
        <AccessSaveBar
          changedTitles={draft.changedAreas.map((area) => area.title)}
          onDiscard={draft.discardDraft}
          onSave={props.onSave}
          onShowChanges={list.showChanges}
          roleTitle={role.title}
          saving={actions.saving}
        />
      ) : null}
    </>
  );
}

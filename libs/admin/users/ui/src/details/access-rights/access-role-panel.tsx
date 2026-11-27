import { filterAccessAreas } from '@admin/users/model';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { AccessGroupSection } from '../../components/access-rights/rights/access-group-section';
import { AccessRightsToolbar } from '../../components/access-rights/rights/access-rights-toolbar';
import { AccessRoleHeader } from '../../components/access-rights/roles/access-role-header';

import type {
  AccessAction,
  AccessArea,
  AccessAreaGroup,
  AccessGrants,
  AccessLevel,
  AccessPageFilter,
  AccessRole,
} from '@admin/users/model';

/** Search, filter and folded groups of the rights list. */
export interface AccessListView {
  search: string;
  filter: AccessPageFilter;
  counts: Readonly<Record<AccessPageFilter, number>>;
  collapsed: ReadonlySet<string>;
  allCollapsed: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: AccessPageFilter) => void;
  onToggleGroup: (title: string) => void;
  onToggleAll: () => void;
}

/** Changes of the role's draft. */
export interface AccessRoleEditing {
  onLevelChange: (area: AccessArea, level: AccessLevel) => void;
  onGroupLevelChange: (group: AccessAreaGroup, level: 'none' | 'view' | 'all') => void;
  onActionChange: (pageKey: string, action: Exclude<AccessAction, 'view'>, on: boolean) => void;
}

interface AccessRolePanelProps {
  role: AccessRole;
  groups: readonly AccessAreaGroup[];
  grants: AccessGrants;
  changed: ReadonlySet<string>;
  /** False while saving, or for the director. */
  editable: boolean;
  /** The last save failed; `conflict` means someone else saved the role first. */
  saveError: { message: string; conflict: boolean } | null;
  view: AccessListView;
  editing: AccessRoleEditing;
  onCopy: () => void;
  onRename: () => void;
  onDelete: () => void;
  onReload: () => void;
  onClearSaveError: () => void;
}

/** The right column: the selected role, its search and filters, and its pages by menu group. */
export function AccessRolePanel(props: AccessRolePanelProps) {
  const { role, groups, grants, changed, editable, saveError, view, editing } = props;
  const narrowed = view.search.trim() !== '' || view.filter !== 'all';
  const visible = groups
    .map((group) => ({
      group,
      areas: filterAccessAreas(group.areas, {
        search: view.search,
        filter: view.filter,
        grants,
        changed,
      }),
    }))
    .filter((item) => item.areas.length > 0);

  return (
    <Stack aria-label={`Права ролі «${role.title}»`} component="section" spacing={2}>
      <AccessRoleHeader
        editable={editable}
        onCopy={props.onCopy}
        onDelete={props.onDelete}
        onRename={props.onRename}
        role={role}
      />
      {saveError ? (
        <Alert
          action={
            saveError.conflict ? (
              <Button color="inherit" onClick={props.onReload} size="small">
                Перезавантажити
              </Button>
            ) : undefined
          }
          onClose={saveError.conflict ? undefined : props.onClearSaveError}
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
      ) : (
        <>
          <AccessRightsToolbar
            allCollapsed={view.allCollapsed}
            counts={view.counts}
            filter={view.filter}
            onFilterChange={view.onFilterChange}
            onSearchChange={view.onSearchChange}
            onToggleAll={view.onToggleAll}
            search={view.search}
          />
          {visible.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', py: 2 }} variant="body2">
              {view.filter === 'changed' && !view.search ? 'Змін ще немає.' : 'Нічого не знайдено.'}
            </Typography>
          ) : (
            visible.map(({ group, areas }) => (
              <AccessGroupSection
                changed={changed}
                disabled={!editable}
                expanded={narrowed || !view.collapsed.has(group.title)}
                grants={grants}
                group={group}
                key={group.title}
                onActionChange={editing.onActionChange}
                onGroupLevelChange={editing.onGroupLevelChange}
                onLevelChange={editing.onLevelChange}
                onToggle={() => view.onToggleGroup(group.title)}
                visibleAreas={areas}
              />
            ))
          )}
        </>
      )}
    </Stack>
  );
}

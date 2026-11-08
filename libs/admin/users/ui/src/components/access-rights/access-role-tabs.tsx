import { Tab, Tabs } from '@mui/material';

import type { AccessRole } from '@admin/users/model';

interface AccessRoleTabsProps {
  roles: readonly AccessRole[];
  selected: string;
  onSelect: (roleName: string) => void;
}

/** One tab per role, in the server order; the director tab is read-only content. */
export function AccessRoleTabs({ onSelect, roles, selected }: AccessRoleTabsProps) {
  return (
    <Tabs
      allowScrollButtonsMobile
      aria-label="Ролі"
      onChange={(_event, value: string) => onSelect(value)}
      scrollButtons="auto"
      sx={{ borderBottom: 1, borderColor: 'divider' }}
      value={roles.some((role) => role.name === selected) ? selected : false}
      variant="scrollable"
    >
      {roles.map((role) => (
        <Tab
          id={`access-role-tab-${role.name}`}
          key={role.name}
          label={role.title}
          sx={{ textTransform: 'none' }}
          value={role.name}
        />
      ))}
    </Tabs>
  );
}

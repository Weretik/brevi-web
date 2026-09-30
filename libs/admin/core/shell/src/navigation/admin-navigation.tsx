import { Box, List } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { AdminNavigationGroup } from './admin-navigation-group';

import type { AdminNavigationGroup as NavigationGroup } from '../shell.types';

interface AdminNavigationProps {
  ariaLabel: string;
  groups: readonly NavigationGroup[];
  onNavigate?: () => void;
}

export function AdminNavigation({ ariaLabel, groups, onNavigate }: AdminNavigationProps) {
  const { pathname } = useLocation();
  const listPrefix = ariaLabel === 'Мобільна навігація' ? 'mobile' : 'desktop';

  return (
    <Box
      aria-label={ariaLabel}
      component="nav"
      sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 1.5, pb: 2, pt: 0.5 }}
    >
      <List disablePadding>
        {groups.map((group) => (
          <AdminNavigationGroup
            group={group}
            key={group.id}
            listId={`${listPrefix}-${group.id}`}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        ))}
      </List>
    </Box>
  );
}

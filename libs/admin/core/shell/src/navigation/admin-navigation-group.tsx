import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useState } from 'react';

import { AdminNavigationItemView, matchesRoute } from './admin-navigation-item';

import type { AdminNavigationGroup as NavigationGroup } from '../shell.types';

interface AdminNavigationGroupProps {
  group: NavigationGroup;
  listId: string;
  pathname: string;
  onNavigate?: () => void;
}

export function AdminNavigationGroup({
  group,
  listId,
  pathname,
  onNavigate,
}: AdminNavigationGroupProps) {
  const [expandedState, setExpandedState] = useState<{ pathname: string; expanded: boolean }>();
  const containsCurrent = group.items.some((item) => item.to && matchesRoute(pathname, item.to));
  const isExpanded =
    expandedState?.pathname === pathname ? expandedState.expanded : containsCurrent;

  return (
    <Box component="li" sx={{ listStyle: 'none', mb: 0.5 }}>
      <ListItemButton
        aria-controls={listId}
        aria-expanded={isExpanded}
        aria-label={group.label}
        component="button"
        onClick={() => setExpandedState({ pathname, expanded: !isExpanded })}
        sx={{
          borderRadius: 1.5,
          color: '#f5f5f5',
          minHeight: 44,
          px: 1.5,
          width: '100%',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
          '& .MuiSvgIcon-root': { color: '#aeb0bd', fontSize: 20 },
        }}
      >
        <ListItemText primary={group.label} slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List
          aria-label={group.label}
          disablePadding
          id={listId}
          sx={{ borderLeft: '1px solid rgba(255, 255, 255, 0.18)', ml: 2.25, pl: 1.5 }}
        >
          {group.items.map((item) => (
            <AdminNavigationItemView
              item={item}
              key={item.id}
              onNavigate={onNavigate}
              pathname={pathname}
            />
          ))}
        </List>
      </Collapse>
    </Box>
  );
}

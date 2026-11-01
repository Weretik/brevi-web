import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRef, useState } from 'react';

import { getNavigationPalette } from '../navigation-palette';
import { AdminNavigationFlyout } from './admin-navigation-flyout';
import { AdminNavigationItemView } from './admin-navigation-item';
import { matchesRoute } from './navigation-route';
import { navigationRowSx } from './navigation-row';

import type { AdminNavigationGroup as NavigationGroup } from '../../shell.types';

interface AdminNavigationGroupProps {
  collapsed: boolean;
  group: NavigationGroup;
  listId: string;
  pathname: string;
  onNavigate?: () => void;
}

const flyoutCloseDelay = 150;

export function AdminNavigationGroup({
  collapsed,
  group,
  listId,
  pathname,
  onNavigate,
}: AdminNavigationGroupProps) {
  const [expandedState, setExpandedState] = useState<{ pathname: string; expanded: boolean }>();
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const containsCurrent = group.items.some((item) => item.to && matchesRoute(pathname, item.to));
  const isExpanded =
    expandedState?.pathname === pathname ? expandedState.expanded : containsCurrent;
  const Icon = group.icon ?? FolderOutlinedIcon;

  const openFlyout = () => {
    window.clearTimeout(closeTimer.current);
    setIsFlyoutOpen(true);
  };
  const scheduleFlyoutClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIsFlyoutOpen(false), flyoutCloseDelay);
  };
  const closeFlyout = () => {
    window.clearTimeout(closeTimer.current);
    setIsFlyoutOpen(false);
  };

  const showExpanded = !collapsed && isExpanded;

  return (
    <Box component="li" sx={{ listStyle: 'none', mb: 0.25 }}>
      <ListItemButton
        aria-controls={collapsed ? (isFlyoutOpen ? `${listId}-flyout` : undefined) : listId}
        aria-expanded={collapsed ? isFlyoutOpen : isExpanded}
        aria-haspopup={collapsed ? 'true' : undefined}
        aria-label={group.label}
        component="button"
        onClick={() =>
          collapsed ? openFlyout() : setExpandedState({ pathname, expanded: !isExpanded })
        }
        onKeyDown={(event) => {
          if (collapsed && event.key === 'Escape') closeFlyout();
        }}
        onMouseEnter={collapsed ? openFlyout : undefined}
        onMouseLeave={collapsed ? scheduleFlyoutClose : undefined}
        ref={buttonRef}
        sx={(theme) => ({
          ...navigationRowSx(theme),
          ...(collapsed && containsCurrent
            ? { bgcolor: getNavigationPalette(theme).hover, color: theme.palette.primary.main }
            : {}),
        })}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: 1.5 }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={group.label}
          slotProps={{ primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 600 } } }}
          sx={{ opacity: collapsed ? 0 : 1, transition: 'opacity 150ms' }}
        />
        <ChevronRightIcon
          aria-hidden="true"
          fontSize="small"
          sx={{
            opacity: collapsed ? 0 : 0.7,
            transform: showExpanded ? 'rotate(90deg)' : 'none',
            transition: (theme) => theme.transitions.create(['transform', 'opacity']),
          }}
        />
      </ListItemButton>
      {collapsed ? (
        <AdminNavigationFlyout
          anchorElement={buttonRef.current}
          group={group}
          id={`${listId}-flyout`}
          onClose={closeFlyout}
          onPointerEnter={openFlyout}
          onPointerLeave={scheduleFlyoutClose}
          open={isFlyoutOpen}
          pathname={pathname}
        />
      ) : (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List
            aria-label={group.label}
            disablePadding
            id={listId}
            sx={(theme) => ({
              borderLeft: `1px solid ${getNavigationPalette(theme).divider}`,
              ml: 2.75,
              my: 0.5,
              pl: 1,
            })}
          >
            {group.items.map((item) => (
              <AdminNavigationItemView
                isCurrent={item.to ? matchesRoute(pathname, item.to) : false}
                item={item}
                key={item.id}
                onNavigate={onNavigate}
                surface="sidebar"
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
}

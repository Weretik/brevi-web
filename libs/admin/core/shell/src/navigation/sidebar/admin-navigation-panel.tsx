import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';

import { getNavigationPalette } from '../navigation-palette';
import { AdminNavigationLogo } from './admin-navigation-logo';
import { AdminNavigation } from '../menu/admin-navigation';
import { navigationRowSx } from '../menu/navigation-row';

import type { AdminNavigationGroup } from '../../layout/admin-shell-contract';

interface AdminNavigationPanelProps {
  collapsed: boolean;
  groups: readonly AdminNavigationGroup[];
  mobile: boolean;
  homeHint?: string | null;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
}

export function AdminNavigationPanel({
  collapsed,
  groups,
  mobile,
  homeHint = null,
  onNavigate,
  onToggleCollapsed,
}: AdminNavigationPanelProps) {
  const toggleLabel = collapsed ? 'Розгорнути меню' : 'Згорнути меню';
  const ToggleIcon = collapsed ? KeyboardDoubleArrowRightIcon : KeyboardDoubleArrowLeftIcon;
  const toggleButton = (
    <ListItemButton
      aria-label={toggleLabel}
      component="button"
      onClick={onToggleCollapsed}
      sx={(theme) => ({ ...navigationRowSx(theme), color: getNavigationPalette(theme).textMuted })}
    >
      <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: 1.5 }}>
        <ToggleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={toggleLabel}
        slotProps={{ primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 600 } } }}
        sx={{ opacity: collapsed ? 0 : 1, transition: 'opacity 150ms' }}
      />
    </ListItemButton>
  );

  return (
    <Box
      sx={(theme) => ({
        bgcolor: getNavigationPalette(theme).background,
        color: getNavigationPalette(theme).text,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      })}
    >
      <AdminNavigationLogo collapsed={collapsed} />
      <AdminNavigation
        ariaLabel={mobile ? 'Мобільна навігація' : 'Основна навігація'}
        collapsed={collapsed}
        groups={groups}
        homeHint={homeHint}
        listPrefix={mobile ? 'mobile' : 'desktop'}
        onNavigate={onNavigate}
      />
      {onToggleCollapsed ? (
        <Box
          sx={(theme) => ({
            borderTop: `1px solid ${getNavigationPalette(theme).divider}`,
            p: 1.5,
          })}
        >
          {collapsed ? (
            <Tooltip placement="right" title={toggleLabel}>
              {toggleButton}
            </Tooltip>
          ) : (
            toggleButton
          )}
        </Box>
      ) : null}
    </Box>
  );
}

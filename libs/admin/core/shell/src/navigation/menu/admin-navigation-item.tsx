import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import { getNavigationPalette } from '../navigation-palette';

import type { AdminNavigationItem } from '../../layout/admin-shell-contract';

interface AdminNavigationItemProps {
  item: AdminNavigationItem;
  isCurrent: boolean;
  /** `sidebar` sits on the dark navigation surface, `flyout` on a paper popup. */
  surface: 'sidebar' | 'flyout';
  onNavigate?: () => void;
}

export function AdminNavigationItemView({
  item,
  isCurrent,
  surface,
  onNavigate,
}: AdminNavigationItemProps) {
  const onSidebar = surface === 'sidebar';
  const itemText = (
    <ListItemText
      primary={item.label}
      secondary={item.to ? undefined : 'Ще не доступно'}
      slotProps={{
        primary: { noWrap: true, sx: { fontSize: 13.5, fontWeight: isCurrent ? 700 : 500 } },
        secondary: {
          sx: (theme) => ({
            color: onSidebar ? getNavigationPalette(theme).textMuted : 'text.secondary',
            fontSize: 11,
            opacity: 0.85,
          }),
        },
      }}
      sx={{ my: 0.25 }}
    />
  );
  const dot = onSidebar ? (
    <Box
      aria-hidden="true"
      sx={{
        bgcolor: 'currentColor',
        borderRadius: '50%',
        flex: 'none',
        height: 5,
        mr: 1.25,
        opacity: 0.5,
        width: 5,
      }}
    />
  ) : null;

  if (!item.to) {
    return (
      <ListItem
        sx={(theme) => ({
          color: onSidebar ? getNavigationPalette(theme).textMuted : 'text.secondary',
          minHeight: 36,
          opacity: 0.75,
          px: 1.5,
          py: 0,
        })}
      >
        {dot}
        {itemText}
      </ListItem>
    );
  }

  return (
    <ListItem disablePadding>
      <ListItemButton
        aria-current={isCurrent ? 'page' : undefined}
        component={Link}
        onClick={onNavigate}
        selected={isCurrent}
        sx={(theme) => {
          const nav = getNavigationPalette(theme);
          return {
            borderRadius: 1.5,
            color: onSidebar ? nav.text : 'text.primary',
            minHeight: 36,
            mb: 0.25,
            px: 1.5,
            py: 0,
            '&:hover': { bgcolor: onSidebar ? nav.hover : 'action.hover' },
            '&.Mui-selected, &.Mui-selected:hover': {
              bgcolor: onSidebar ? nav.activeBackground : 'primary.light',
              color: onSidebar ? nav.activeText : 'primary.dark',
            },
          };
        }}
        to={item.to}
      >
        {dot}
        {itemText}
      </ListItemButton>
    </ListItem>
  );
}

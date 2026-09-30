import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import type { AdminNavigationItem } from '../shell.types';

interface AdminNavigationItemProps {
  item: AdminNavigationItem;
  pathname: string;
  onNavigate?: () => void;
}

export function matchesRoute(pathname: string, to: string): boolean {
  return pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
}

export function AdminNavigationItemView({ item, pathname, onNavigate }: AdminNavigationItemProps) {
  const isCurrent = item.to ? matchesRoute(pathname, item.to) : false;
  const itemText = (
    <ListItemText
      primary={item.label}
      secondary={item.to ? undefined : 'Ще не доступно'}
      slotProps={{ secondary: { sx: { color: '#aeb0bd', fontSize: 11 } } }}
      sx={{ '& .MuiListItemText-primary': { fontWeight: isCurrent ? 700 : 500 } }}
    />
  );

  if (!item.to) {
    return <ListItem sx={{ color: '#c4c4c8', px: 1.5, py: 0.25 }}>{itemText}</ListItem>;
  }

  return (
    <ListItem disablePadding>
      <ListItemButton
        aria-current={isCurrent ? 'page' : undefined}
        component={Link}
        onClick={onNavigate}
        selected={isCurrent}
        sx={{
          borderRadius: 1.5,
          color: '#f5f5f5',
          mb: 0.5,
          minHeight: 40,
          px: 1.5,
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.main' },
          },
        }}
        to={item.to}
      >
        {itemText}
      </ListItemButton>
    </ListItem>
  );
}

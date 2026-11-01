import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { homeLabel } from '../../navigation/menu/admin-navigation';
import { findCurrentEntry } from '../../navigation/menu/navigation-route';

import type { AdminNavigationGroup } from '../../shell.types';

interface AdminBreadcrumbsProps {
  navigation: readonly AdminNavigationGroup[];
}

/** Where the user is: group and page from the navigation that owns the current route. */
export function AdminBreadcrumbs({ navigation }: AdminBreadcrumbsProps) {
  const { pathname } = useLocation();
  const entry = pathname === '/' ? undefined : findCurrentEntry(navigation, pathname);
  const trail = entry ? [entry.group.label, entry.item.label] : ['Brevi', homeLabel];

  return (
    <Breadcrumbs
      aria-label="Розташування"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ flexGrow: 1, minWidth: 0, '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}
    >
      {trail.map((label, index) => {
        const isLast = index === trail.length - 1;
        return (
          <Typography
            aria-current={isLast ? 'location' : undefined}
            color={isLast ? 'text.primary' : 'text.secondary'}
            component="span"
            key={`${index}-${label}`}
            noWrap
            sx={{
              display: isLast ? 'block' : { xs: 'none', sm: 'block' },
              fontSize: 14,
              fontWeight: isLast ? 600 : 500,
            }}
          >
            {label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

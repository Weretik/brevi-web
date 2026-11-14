import { ClickAwayListener, List, Paper, Popper, Typography } from '@mui/material';

import { AdminNavigationItemView } from './admin-navigation-item';
import { matchesRoute } from './navigation-route';

import type { AdminNavigationGroup } from '../../layout/admin-shell-contract';

interface AdminNavigationFlyoutProps {
  anchorElement: HTMLElement | null;
  group: AdminNavigationGroup;
  id: string;
  open: boolean;
  pathname: string;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

/** Item list of a group, shown beside its icon while the sidebar is collapsed. */
export function AdminNavigationFlyout({
  anchorElement,
  group,
  id,
  open,
  pathname,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: AdminNavigationFlyoutProps) {
  return (
    <Popper
      anchorEl={anchorElement}
      // Rendered right after its group button so Tab moves from the icon into the links.
      disablePortal
      modifiers={[{ name: 'offset', options: { offset: [-6, 10] } }]}
      open={open}
      placement="right-start"
      popperOptions={{ strategy: 'fixed' }}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
    >
      <ClickAwayListener
        onClickAway={(event) => {
          // The click that opened the flyout must not close it again.
          if (!anchorElement?.contains(event.target as Node)) onClose();
        }}
      >
        <Paper
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              onClose();
              anchorElement?.focus();
            }
          }}
          onMouseEnter={onPointerEnter}
          onMouseLeave={onPointerLeave}
          sx={{
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
            minWidth: 232,
            p: 0.75,
          }}
        >
          <Typography
            component="p"
            sx={{ color: 'text.secondary', px: 1.25, pb: 0.5, pt: 0.75 }}
            variant="overline"
          >
            {group.label}
          </Typography>
          <List aria-label={group.label} dense disablePadding id={id}>
            {group.items.map((item) => (
              <AdminNavigationItemView
                isCurrent={item.to ? matchesRoute(pathname, item.to) : false}
                item={item}
                key={item.id}
                onNavigate={onClose}
                surface="flyout"
              />
            ))}
          </List>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}

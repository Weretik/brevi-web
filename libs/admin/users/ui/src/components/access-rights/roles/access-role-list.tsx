import { describeRoleAccess, normalizeAccessGrants } from '@admin/users/model';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Box, Button, Card, List, ListItemButton, Stack, Typography } from '@mui/material';

import type { AccessArea, AccessGrants, AccessRole } from '@admin/users/model';

interface AccessRoleListProps {
  roles: readonly AccessRole[];
  areas: readonly AccessArea[];
  selected: string;
  /** The unsaved switches of the selected role, so its page count follows them. */
  draft: AccessGrants;
  dirty: boolean;
  comparing: boolean;
  onSelect: (roleName: string) => void;
  onCompare: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** The left column: every role with its people and pages, and «Порівняти ролі». */
export function AccessRoleList({
  areas,
  comparing,
  dirty,
  draft,
  onCompare,
  onSelect,
  roles,
  selected,
}: AccessRoleListProps) {
  return (
    <Card component="nav" aria-label="Ролі" variant="outlined">
      <List dense disablePadding>
        {roles.map((role) => {
          const isSelected = !comparing && role.name === selected;
          const grants = isSelected ? draft : normalizeAccessGrants(role.grants, areas);
          const summary = describeRoleAccess(role, grants, areas);
          return (
            <ListItemButton
              aria-current={isSelected ? 'page' : undefined}
              divider
              key={role.name}
              onClick={() => onSelect(role.name)}
              selected={isSelected}
              sx={{ alignItems: 'flex-start', display: 'block', py: 1 }}
            >
              <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600 }} variant="body2">
                  {role.title}
                </Typography>
                <Box
                  aria-label={`Користувачів: ${role.userCount}`}
                  component="span"
                  sx={{ ...mono, color: 'text.secondary', typography: 'body2' }}
                >
                  {role.userCount}
                </Box>
              </Stack>
              <Typography sx={{ color: 'text.secondary' }} variant="caption">
                {summary}
                {isSelected && dirty ? ' · не збережено' : ''}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 1 }}>
        <Button
          aria-pressed={comparing}
          fullWidth
          onClick={onCompare}
          startIcon={<CompareArrowsIcon />}
          variant={comparing ? 'contained' : 'outlined'}
          color={comparing ? 'secondary' : 'inherit'}
        >
          Порівняти ролі
        </Button>
      </Box>
    </Card>
  );
}

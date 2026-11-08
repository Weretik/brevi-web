import { accessActionLabels, accessChangeActions, describeGroupAccess } from '@admin/users/model';
import { Box, Card, Stack, Typography } from '@mui/material';

import { AccessPageRow, accessRowColumns } from './access-page-row';

import type { AccessAction, AccessAreaGroup, AccessGrants } from '@admin/users/model';

interface AccessGroupCardProps {
  group: AccessAreaGroup;
  grants: AccessGrants;
  disabled: boolean;
  onViewChange: (pageKey: string, on: boolean) => void;
  onActionChange: (pageKey: string, action: Exclude<AccessAction, 'view'>, on: boolean) => void;
}

/** A menu group as a card: title, «N з M сторінок», and one row per page. */
export function AccessGroupCard({
  disabled,
  grants,
  group,
  onActionChange,
  onViewChange,
}: AccessGroupCardProps) {
  return (
    <Card component="section" sx={{ p: 2 }} variant="outlined">
      <Stack
        direction="row"
        sx={{ alignItems: 'baseline', gap: 2, justifyContent: 'space-between', mb: 1 }}
      >
        <Typography component="h2" variant="h6">
          {group.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }} variant="body2">
          {describeGroupAccess(group, grants)}
        </Typography>
      </Stack>
      <Box
        aria-hidden
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.secondary',
          columnGap: 1,
          display: { xs: 'none', sm: 'grid' },
          gridTemplateColumns: accessRowColumns,
          pb: 0.75,
        }}
      >
        <Typography variant="overline">Сторінка</Typography>
        <Typography variant="overline">{accessActionLabels.view}</Typography>
        {accessChangeActions.map((action) => (
          <Typography key={action} variant="overline">
            {accessActionLabels[action]}
          </Typography>
        ))}
      </Box>
      {group.areas.map((area) => (
        <AccessPageRow
          area={area}
          disabled={disabled}
          grants={grants}
          key={area.key}
          onActionChange={onActionChange}
          onViewChange={onViewChange}
        />
      ))}
    </Card>
  );
}

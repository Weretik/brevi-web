import { accessActionLabels, accessChangeActions, hasAccessAction } from '@admin/users/model';
import { Box, Checkbox, FormControlLabel, Switch, Typography } from '@mui/material';

import type { AccessAction, AccessArea, AccessGrants } from '@admin/users/model';

type ChangeAction = Exclude<AccessAction, 'view'>;

/** Columns of a page row; the group card header uses the same template. */
export const accessRowColumns = {
  xs: 'minmax(0, 1fr) auto',
  sm: 'minmax(0, 1fr) 72px repeat(3, 96px)',
} as const;

interface AccessPageRowProps {
  area: AccessArea;
  grants: AccessGrants;
  disabled: boolean;
  onViewChange: (pageKey: string, on: boolean) => void;
  onActionChange: (pageKey: string, action: ChangeAction, on: boolean) => void;
}

/**
 * One page: name, the «Бачить» switch, then a checkbox for each action the page has.
 * On a phone the checkboxes wrap under the name with visible labels.
 */
export function AccessPageRow({
  area,
  disabled,
  grants,
  onActionChange,
  onViewChange,
}: AccessPageRowProps) {
  const sees = hasAccessAction(grants, area.key, 'view');

  return (
    <Box
      sx={{
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        columnGap: 1,
        display: 'grid',
        gridTemplateColumns: accessRowColumns,
        minHeight: 44,
        py: { xs: 0.5, sm: 0 },
        '&:last-of-type': { borderBottom: 0 },
      }}
    >
      <Typography
        sx={{ color: sees ? 'text.primary' : 'text.secondary', minWidth: 0 }}
        variant="body2"
      >
        {area.title}
      </Typography>
      <Box>
        <Switch
          checked={sees}
          disabled={disabled}
          onChange={(event) => onViewChange(area.key, event.target.checked)}
          size="small"
          slotProps={{ input: { 'aria-label': `${accessActionLabels.view}: ${area.title}` } }}
        />
      </Box>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'contents' },
          flexWrap: 'wrap',
          gridColumn: { xs: '1 / -1', sm: 'auto' },
          columnGap: 2,
        }}
      >
        {accessChangeActions.map((action) =>
          area.actions.includes(action) ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={sees && hasAccessAction(grants, area.key, action)}
                  disabled={disabled || !sees}
                  onChange={(event) => onActionChange(area.key, action, event.target.checked)}
                  size="small"
                  slotProps={{
                    input: { 'aria-label': `${accessActionLabels[action]}: ${area.title}` },
                  }}
                />
              }
              key={action}
              label={accessActionLabels[action]}
              sx={{
                mx: 0,
                '& .MuiFormControlLabel-label': {
                  display: { xs: 'inline', sm: 'none' },
                  typography: 'body2',
                },
              }}
            />
          ) : (
            <Box aria-hidden key={action} sx={{ display: { xs: 'none', sm: 'block' } }} />
          ),
        )}
      </Box>
    </Box>
  );
}

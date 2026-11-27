import {
  accessActionLabelOf,
  accessActionLabels,
  accessChangeActions,
  accessLevelOf,
  accessLevelsOf,
  hasAccessAction,
} from '@admin/users/model';
import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { AccessLevelToggle } from './access-level-toggle';

import type { AccessAction, AccessArea, AccessGrants, AccessLevel } from '@admin/users/model';

type ChangeAction = Exclude<AccessAction, 'view'>;

interface AccessPageRowProps {
  area: AccessArea;
  grants: AccessGrants;
  changed: boolean;
  disabled: boolean;
  onLevelChange: (area: AccessArea, level: AccessLevel) => void;
  onActionChange: (pageKey: string, action: ChangeAction, on: boolean) => void;
}

/**
 * One page: its name, the level in one click, and under it the page's real actions («Створювати КП»,
 * «Запускати зараз»), so a level never hides what it gives.
 */
export function AccessPageRow({
  area,
  changed,
  disabled,
  grants,
  onActionChange,
  onLevelChange,
}: AccessPageRowProps) {
  const sees = hasAccessAction(grants, area.key, 'view');
  const level = accessLevelOf(area, grants);
  const viewLabel = accessActionLabelOf(area, 'view');
  const actions = accessChangeActions.filter((action) => area.actions.includes(action));

  return (
    <Box
      data-testid={`access-page-${area.key}`}
      sx={{ borderBottom: 1, borderColor: 'divider', py: 1, '&:last-of-type': { borderBottom: 0 } }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { sm: 'center' }, gap: 1, justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: sees ? 'text.primary' : 'text.secondary' }} variant="body2">
            {area.title}
            {changed ? (
              <Typography component="span" sx={{ color: 'primary.dark', ml: 1 }} variant="caption">
                змінено
              </Typography>
            ) : null}
          </Typography>
          {viewLabel !== accessActionLabels.view ? (
            <Typography sx={{ color: 'text.secondary' }} variant="caption">
              {viewLabel}
            </Typography>
          ) : null}
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          {level === 'custom' ? (
            <Typography sx={{ color: 'text.secondary' }} variant="caption">
              Вибірково
            </Typography>
          ) : null}
          <AccessLevelToggle
            disabled={disabled}
            label={`Рівень: ${area.title}`}
            levels={accessLevelsOf(area)}
            onChange={(next) => onLevelChange(area, next)}
            value={level === 'custom' ? null : level}
          />
        </Stack>
      </Stack>
      {sees && actions.length > 0 ? (
        <Stack direction="row" sx={{ columnGap: 2, flexWrap: 'wrap', pl: { sm: 1 } }}>
          {actions.map((action) => {
            const label = accessActionLabelOf(area, action);
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasAccessAction(grants, area.key, action)}
                    disabled={disabled}
                    onChange={(event) => onActionChange(area.key, action, event.target.checked)}
                    size="small"
                    slotProps={{ input: { 'aria-label': `${label}: ${area.title}` } }}
                  />
                }
                key={action}
                label={label}
                sx={{ mx: 0, '& .MuiFormControlLabel-label': { typography: 'body2' } }}
              />
            );
          })}
        </Stack>
      ) : null}
    </Box>
  );
}

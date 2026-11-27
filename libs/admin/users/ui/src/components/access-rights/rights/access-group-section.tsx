import { describeGroupAccess, groupAccessLevelOf } from '@admin/users/model';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, ButtonBase, Card, Collapse, Stack, Typography } from '@mui/material';
import { useId } from 'react';

import { AccessLevelToggle } from './access-level-toggle';
import { AccessPageRow } from './access-page-row';

import type {
  AccessAction,
  AccessArea,
  AccessAreaGroup,
  AccessGrants,
  AccessLevel,
} from '@admin/users/model';

interface AccessGroupSectionProps {
  group: AccessAreaGroup;
  /** The pages to show after search and filter; the summary and group level count every page. */
  visibleAreas: readonly AccessArea[];
  grants: AccessGrants;
  changed: ReadonlySet<string>;
  expanded: boolean;
  disabled: boolean;
  onToggle: () => void;
  onGroupLevelChange: (group: AccessAreaGroup, level: 'none' | 'view' | 'all') => void;
  onLevelChange: (area: AccessArea, level: AccessLevel) => void;
  onActionChange: (pageKey: string, action: Exclude<AccessAction, 'view'>, on: boolean) => void;
}

const groupLevels: readonly AccessLevel[] = ['none', 'view', 'all'];

/** A menu group: title, «N з M сторінок», one level for the whole group, and its pages when open. */
export function AccessGroupSection({
  changed,
  disabled,
  expanded,
  grants,
  group,
  onActionChange,
  onGroupLevelChange,
  onLevelChange,
  onToggle,
  visibleAreas,
}: AccessGroupSectionProps) {
  const contentId = useId();
  const level = groupAccessLevelOf(group, grants);

  return (
    <Card component="section" variant="outlined">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { sm: 'center' }, gap: 1, justifyContent: 'space-between', px: 2, py: 1 }}
      >
        <ButtonBase
          aria-controls={contentId}
          aria-expanded={expanded}
          onClick={onToggle}
          sx={{ borderRadius: 1, gap: 1, justifyContent: 'flex-start', py: 0.5, textAlign: 'left' }}
        >
          <ExpandMoreIcon
            fontSize="small"
            sx={{ transform: expanded ? 'none' : 'rotate(-90deg)', transition: 'transform 150ms' }}
          />
          <Box>
            <Typography component="h2" variant="h6">
              {group.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }} variant="body2">
              {describeGroupAccess(group, grants)}
            </Typography>
          </Box>
        </ButtonBase>
        <AccessLevelToggle
          disabled={disabled}
          label={`Уся група: ${group.title}`}
          levels={groupLevels}
          onChange={(next) => onGroupLevelChange(group, next === 'work' ? 'all' : next)}
          value={level === 'mixed' ? null : level}
        />
      </Stack>
      <Collapse in={expanded} unmountOnExit>
        <Box id={contentId} sx={{ borderTop: 1, borderColor: 'divider', px: 2 }}>
          {visibleAreas.map((area) => (
            <AccessPageRow
              area={area}
              changed={changed.has(area.key)}
              disabled={disabled}
              grants={grants}
              key={area.key}
              onActionChange={onActionChange}
              onLevelChange={onLevelChange}
            />
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}

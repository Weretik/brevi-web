import { leadStageLabels, leadStageTones } from '@admin/leads/model';
import { Box } from '@mui/material';

import type { LeadStage } from '@admin/leads/model';

interface Props {
  stage: LeadStage;
  /** An overdue next contact wins over the stage: it is what needs attention. */
  overdue?: boolean;
}

/** «Цех» status pill: dot, soft background, always a text label. */
export function LeadStagePill({ stage, overdue = false }: Props) {
  const tone = overdue ? 'error' : leadStageTones[stage];
  const label = overdue ? 'Прострочено' : leadStageLabels[stage];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1,
        borderRadius: 999,
        typography: 'caption',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: tone === 'default' ? 'action.hover' : `${tone}.light`,
        color: tone === 'default' ? 'text.secondary' : `${tone}.main`,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {label}
    </Box>
  );
}

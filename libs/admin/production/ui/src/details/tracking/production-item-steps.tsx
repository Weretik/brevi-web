import { itemStageSteps, productionStageLabels } from '@admin/production/model';
import { Box, Tooltip, Typography } from '@mui/material';

import type { ProductionItem } from '@admin/production/model';

/**
 * The stage bar of an item: one mark per step (ticked graphite, the furthest orange, the rest empty) and the
 * name of the furthest stage under it. «Нанесення» is not a step of an item without applications.
 */
export function ProductionItemSteps({
  item,
}: {
  item: Pick<ProductionItem, 'stages' | 'applications' | 'currentStage' | 'modelName'>;
}) {
  const steps = itemStageSteps(item);
  const position = steps.indexOf(item.currentStage);
  const label = productionStageLabels[item.currentStage];
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        role="img"
        aria-label={`Етап: ${label}${position >= 0 ? ` (${position + 1} з ${steps.length})` : ''}`}
        sx={{ display: 'flex', gap: '3px' }}
      >
        {steps.map((stage) => (
          <Tooltip key={stage} title={productionStageLabels[stage]}>
            <Box
              component="span"
              sx={{
                width: 14,
                height: 6,
                borderRadius: '2px',
                bgcolor:
                  stage === item.currentStage
                    ? 'primary.main'
                    : item.stages.includes(stage)
                      ? 'text.primary'
                      : 'divider',
              }}
            />
          </Tooltip>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" noWrap component="div">
        {label}
      </Typography>
    </Box>
  );
}

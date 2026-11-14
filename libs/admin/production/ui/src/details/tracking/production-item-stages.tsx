import { itemStageSteps, productionStageLabels } from '@admin/production/model';
import CheckIcon from '@mui/icons-material/Check';
import { Chip, Stack } from '@mui/material';

import type { ProductionItem, ProductionStage } from '@admin/production/model';

interface Props {
  item: Pick<ProductionItem, 'modelName' | 'stages' | 'applications'>;
  /** Absent: the person only sees the stages. */
  onToggle?: (stage: ProductionStage) => void;
  busy?: boolean;
}

/**
 * «Етапи» of an item: several can be ticked; the head of the workshop ticks them. «Нове» is where an item
 * starts, not a stage to tick, and «Нанесення» is left out of an item without applications.
 */
export function ProductionItemStages({ item, onToggle, busy = false }: Props) {
  const stages = item.stages;
  return (
    <Stack
      direction="row"
      role="group"
      aria-label={`Етапи: ${item.modelName}`}
      sx={{ flexWrap: 'wrap', gap: 0.75 }}
    >
      {itemStageSteps(item).map((stage) => {
        const ticked = stages.includes(stage);
        if (!onToggle && !ticked) return null;
        return (
          <Chip
            key={stage}
            size="small"
            label={productionStageLabels[stage]}
            color={ticked ? 'primary' : 'default'}
            variant={ticked ? 'filled' : 'outlined'}
            icon={ticked ? <CheckIcon /> : undefined}
            disabled={busy}
            aria-pressed={onToggle ? ticked : undefined}
            onClick={onToggle ? () => onToggle(stage) : undefined}
          />
        );
      })}
    </Stack>
  );
}

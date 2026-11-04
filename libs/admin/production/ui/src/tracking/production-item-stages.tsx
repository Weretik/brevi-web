import { productionStageLabels, productionStages } from '@admin/production/model';
import CheckIcon from '@mui/icons-material/Check';
import { Chip, Stack } from '@mui/material';

import type { ProductionStage } from '@admin/production/model';

interface Props {
  itemName: string;
  stages: ProductionStage[];
  /** Absent: the person only sees the stages. */
  onToggle?: (stage: ProductionStage) => void;
  busy?: boolean;
}

/** «Етапи» of an item: several can be ticked; the head of the workshop ticks them. */
export function ProductionItemStages({ itemName, stages, onToggle, busy = false }: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label={`Етапи: ${itemName}`}
      sx={{ flexWrap: 'wrap', gap: 0.75 }}
    >
      {productionStages.map((stage) => {
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

import { ReferenceEditorDrawer } from '@admin/references/ui';
import { formatPerProduct } from '@admin/warehouse/model';
import { PlanFactDeviation, PlanFactItemDetails } from '@admin/warehouse/ui';
import { Stack, Typography } from '@mui/material';

import type { PlanFactModel } from '@admin/warehouse/model';

interface Props {
  model: PlanFactModel;
  onClose: () => void;
}

/** A model of «План і факт»: its tasks with plan, fact and every fabric by role; the table stays in place. */
export function PlanFactModelDrawer({ model, onClose }: Props) {
  const { summary } = model;
  return (
    <ReferenceEditorDrawer
      titleId="plan-fact-model-title"
      title={model.modelName}
      description={[model.modelCode, `${summary.orders} завд. · ${summary.products} виробів`]
        .filter(Boolean)
        .join(' · ')}
      formId="plan-fact-model"
      paperWidth={720}
      readOnly
      saving={false}
      editLabel={null}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <Stack sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body1" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            План {formatPerProduct(summary.planPerProduct)} / факт{' '}
            {formatPerProduct(summary.factPerProduct)} на виріб
          </Typography>
          <PlanFactDeviation summary={summary} />
        </Stack>
        {summary.uncomparableItems > 0 && (
          <Typography variant="body2" color="warning.main">
            Не порівняти: {summary.uncomparableItems} завд. Причина — під завданням.
          </Typography>
        )}
        {model.items.map((item) => (
          <PlanFactItemDetails key={item.itemId} item={item} />
        ))}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

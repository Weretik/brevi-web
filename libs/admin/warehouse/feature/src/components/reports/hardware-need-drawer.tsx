import { ReferenceEditorDrawer } from '@admin/references/ui';
import { formatQuantity, hardwareUnitLabel } from '@admin/warehouse/model';
import { HardwareNeedShares, hardwareTasks } from '@admin/warehouse/ui';
import { Alert, Stack, Typography } from '@mui/material';

import type { HardwareNeed } from '@admin/warehouse/model';

interface Props {
  need: HardwareNeed;
  onClose: () => void;
}

/** An accessory of «Що замовити › Фурнітура»: how its need adds up, task by task. */
export function HardwareNeedDrawer({ need, onClose }: Props) {
  const unit = hardwareUnitLabel(need.unit);
  return (
    <ReferenceEditorDrawer
      titleId="hardware-need-title"
      title={need.name}
      description={[need.code, need.note].filter(Boolean).join(' · ')}
      formId="hardware-need"
      paperWidth={600}
      readOnly
      saving={false}
      editLabel={null}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatQuantity(need.quantity)} {unit} на {hardwareTasks(need)} завд.
        </Typography>
        {!need.nameChecked && (
          <Alert severity="warning">
            Коду {need.code} немає в довіднику «Фурнітура»: кількість врахована, назву треба
            перевірити.
          </Alert>
        )}
        <HardwareNeedShares need={need} />
        <Typography variant="body2" color="text.secondary">
          Повна потреба за складом моделей; складські залишки та видачі не віднімаються.
        </Typography>
      </Stack>
    </ReferenceEditorDrawer>
  );
}

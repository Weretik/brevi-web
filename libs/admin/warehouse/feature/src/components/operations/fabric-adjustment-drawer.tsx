import { ReferenceEditorDrawer } from '@admin/references/ui';
import { useAdjustFabricStockMutation } from '@admin/warehouse/data-access';
import {
  adjustmentDelta,
  createFabricAdjustmentValues,
  fabricAdjustmentBody,
  kyivToday,
  validateFabricAdjustment,
} from '@admin/warehouse/model';
import { FabricAdjustmentForm } from '@admin/warehouse/ui';
import { Alert, Stack } from '@mui/material';

import { operationMessage, useStockOperation } from '../../hooks/operations/use-stock-operation';

import type { FabricStockPair } from '@admin/warehouse/model';

interface Props {
  pair: FabricStockPair;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** «Уточнити»: the counted total of a fabric and colour; the server checks the pair has not moved. */
export function FabricAdjustmentDrawer({ pair, onClose, onSaved }: Props) {
  const [adjust] = useAdjustFabricStockMutation();
  const current = pair.color.meters;
  const form = useStockOperation({
    initial: () => createFabricAdjustmentValues(kyivToday(), current),
    validate: (values) => validateFabricAdjustment(values, current),
    body: (values, operationId) => fabricAdjustmentBody(values, pair, operationId),
    send: (body) => adjust(body).unwrap(),
    fallback: 'Не вдалося уточнити залишок.',
    onSaved: (result) => onSaved(operationMessage(result, 'Залишок уточнено.')),
  });
  return (
    <ReferenceEditorDrawer
      titleId="fabric-adjustment-title"
      title="Уточнити залишок"
      description="Вкажіть, скільки тканини є насправді. Уточнення не може створити чи збільшити нестачу."
      formId="fabric-adjustment-form"
      paperWidth={560}
      readOnly={false}
      editLabel={null}
      saving={form.saving}
      submitLabel="Уточнити"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => void form.save()}
    >
      <Stack sx={{ gap: 2 }}>
        {form.message && <Alert severity="error">{form.message}</Alert>}
        <FabricAdjustmentForm
          values={form.values}
          errors={form.errors}
          pair={pair}
          delta={adjustmentDelta(form.values, current)}
          disabled={form.saving}
          onChange={form.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

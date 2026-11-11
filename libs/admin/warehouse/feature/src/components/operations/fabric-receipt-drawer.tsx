import { ReferenceEditorDrawer } from '@admin/references/ui';
import {
  useGetFabricStockChoicesQuery,
  useReceiveFabricMutation,
} from '@admin/warehouse/data-access';
import {
  createFabricReceiptValues,
  fabricReceiptBody,
  kyivToday,
  nextFabricReceiptValues,
  validateFabricReceipt,
} from '@admin/warehouse/model';
import { FabricReceiptForm } from '@admin/warehouse/ui';
import { Alert, LinearProgress, Stack } from '@mui/material';
import { useState } from 'react';

import { operationMessage, useStockOperation } from '../../hooks/operations/use-stock-operation';

interface Props {
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** «Прихід»: after a save the form stays open for the next roll, keeping fabric and colour. */
export function FabricReceiptDrawer({ onClose, onSaved }: Props) {
  const choices = useGetFabricStockChoicesQuery();
  const [receive] = useReceiveFabricMutation();
  const [saved, setSaved] = useState<string | null>(null);
  const form = useStockOperation({
    initial: () => createFabricReceiptValues(kyivToday()),
    validate: validateFabricReceipt,
    body: fabricReceiptBody,
    send: (body) => receive(body).unwrap(),
    fallback: 'Не вдалося записати прихід.',
    onSaved: (result, values) => {
      const text = operationMessage(result, 'Прихід записано. Залишок оновлено.');
      setSaved(text);
      onSaved(text);
      form.reset(nextFabricReceiptValues(values));
    },
  });
  return (
    <ReferenceEditorDrawer
      titleId="fabric-receipt-title"
      title="Прихід тканини"
      description="Тканина, що прийшла від постачальника. Залишок пари оновиться одразу."
      formId="fabric-receipt-form"
      paperWidth={640}
      readOnly={false}
      editLabel={null}
      saving={form.saving}
      submitLabel="Записати прихід"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => {
        setSaved(null);
        void form.save();
      }}
    >
      <Stack sx={{ gap: 2 }}>
        {choices.isFetching && <LinearProgress />}
        {choices.error && <Alert severity="error">Не вдалося завантажити тканини й кольори.</Alert>}
        {saved && <Alert severity="success">{saved}</Alert>}
        {form.message && <Alert severity="error">{form.message}</Alert>}
        {choices.data && (
          <FabricReceiptForm
            values={form.values}
            errors={form.errors}
            choices={choices.data}
            disabled={form.saving}
            onChange={(values) => {
              setSaved(null);
              form.change(values);
            }}
          />
        )}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

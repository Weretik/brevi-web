import { ReferenceEditorDrawer } from '@admin/references/ui';
import {
  useGetFabricStockChoicesQuery,
  useOpenFabricStockMutation,
} from '@admin/warehouse/data-access';
import {
  createFabricOpeningValues,
  fabricOpeningBody,
  kyivToday,
  validateFabricOpening,
} from '@admin/warehouse/model';
import { FabricOpeningForm } from '@admin/warehouse/ui';
import { Alert, LinearProgress, Stack } from '@mui/material';
import { useState } from 'react';

import { operationMessage, useStockOperation } from '../../hooks/operations/use-stock-operation';

interface Props {
  onClose: () => void;
  onSaved: (message: string) => void;
}

/**
 * «Внести початковий залишок» (was its own page): once per fabric and colour when the stock starts;
 * later changes are a receipt or «Уточнити». The form stays open for the next pair.
 */
export function FabricOpeningDrawer({ onClose, onSaved }: Props) {
  const choices = useGetFabricStockChoicesQuery();
  const [open] = useOpenFabricStockMutation();
  const [saved, setSaved] = useState<string | null>(null);
  const form = useStockOperation({
    initial: () => createFabricOpeningValues(kyivToday()),
    validate: validateFabricOpening,
    body: fabricOpeningBody,
    send: (body) => open(body).unwrap(),
    fallback: 'Не вдалося внести початковий залишок.',
    onSaved: (result, values) => {
      const text = operationMessage(result, 'Початковий залишок внесено.');
      setSaved(text);
      onSaved(text);
      form.reset({ ...createFabricOpeningValues(values.operationDate), fabricId: values.fabricId });
    },
  });
  return (
    <ReferenceEditorDrawer
      titleId="fabric-opening-title"
      title="Початковий залишок"
      description="Один раз на тканину й колір, коли склад починають вести. Далі — прихід або «Уточнити»."
      formId="fabric-opening-form"
      paperWidth={640}
      readOnly={false}
      editLabel={null}
      saving={form.saving}
      submitLabel="Внести початковий залишок"
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
          <FabricOpeningForm
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

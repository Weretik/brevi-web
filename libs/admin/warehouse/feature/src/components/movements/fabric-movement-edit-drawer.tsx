import { ReferenceEditorDrawer } from '@admin/references/ui';
import {
  useEditFabricMovementMutation,
  useGetFabricStockChoicesQuery,
} from '@admin/warehouse/data-access';
import {
  createMovementEditValues,
  findStockPair,
  movementEditBody,
  validateMovementEdit,
} from '@admin/warehouse/model';
import { FabricMovementEditForm } from '@admin/warehouse/ui';
import { Alert, LinearProgress, Stack } from '@mui/material';

import { operationMessage, useStockOperation } from '../../hooks/operations/use-stock-operation';

import type { FabricMovementRow, FabricStockFabric } from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  /** Pairs the stock holds, for moving an issue. */
  fabrics: readonly FabricStockFabric[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** Edit of one movement in the side panel; later records of both lines are restated by the server. */
export function FabricMovementEditDrawer({ row, fabrics, onClose, onSaved }: Props) {
  const choices = useGetFabricStockChoicesQuery(undefined, { skip: row.kind !== 'Receipt' });
  const [edit] = useEditFabricMovementMutation();
  const form = useStockOperation({
    initial: () => createMovementEditValues(row),
    validate: (values) => validateMovementEdit(row, values),
    body: (values, operationId) =>
      movementEditBody(
        row,
        values,
        findStockPair(fabrics, values.pairCode, values.pairColorKey),
        operationId,
      ),
    send: (body) => edit({ movementId: row.id, body }).unwrap(),
    fallback: 'Не вдалося зберегти правку.',
    onSaved: (result) =>
      onSaved(operationMessage(result, 'Правку збережено. Залишки перераховано.')),
  });
  return (
    <ReferenceEditorDrawer
      titleId="fabric-movement-edit-title"
      title="Правка руху"
      description="Змінюється лише цей запис; старі значення лишаться в історії правок."
      formId="fabric-movement-edit-form"
      paperWidth={640}
      readOnly={false}
      editLabel={null}
      saving={form.saving}
      submitLabel="Зберегти правку"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => void form.save()}
    >
      <Stack sx={{ gap: 2 }}>
        {choices.isFetching && <LinearProgress />}
        {choices.error && <Alert severity="error">Не вдалося завантажити тканини й кольори.</Alert>}
        {form.message && <Alert severity="error">{form.message}</Alert>}
        <FabricMovementEditForm
          row={row}
          values={form.values}
          errors={form.errors}
          choices={choices.data}
          fabrics={fabrics}
          disabled={form.saving}
          onChange={form.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

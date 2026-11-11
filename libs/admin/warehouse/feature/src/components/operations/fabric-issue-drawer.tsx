import { ReferenceEditorDrawer } from '@admin/references/ui';
import { useIssueFabricMutation } from '@admin/warehouse/data-access';
import {
  balanceAfterIssue,
  createFabricIssueValues,
  fabricIssueBody,
  findStockPair,
  kyivToday,
  validateFabricIssue,
} from '@admin/warehouse/model';
import { FabricIssueForm } from '@admin/warehouse/ui';
import { Alert, Stack } from '@mui/material';

import { operationMessage, useStockOperation } from '../../hooks/operations/use-stock-operation';

import type { FabricStockFabric } from '@admin/warehouse/model';

interface Props {
  fabrics: readonly FabricStockFabric[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** «Разова витрата / без замовлення»: real metres of a pair; it never covers an order's plan. */
export function FabricIssueDrawer({ fabrics, onClose, onSaved }: Props) {
  const [issue] = useIssueFabricMutation();
  const pairOf = (values: { fabricCode: string | null; colorKey: string | null }) =>
    findStockPair(fabrics, values.fabricCode, values.colorKey);
  const form = useStockOperation({
    initial: () => createFabricIssueValues(kyivToday()),
    validate: (values) => validateFabricIssue(values, pairOf(values)),
    body: (values, operationId) => {
      const pair = pairOf(values);
      return pair ? fabricIssueBody(values, pair, operationId) : null;
    },
    send: (body) => issue(body).unwrap(),
    fallback: 'Не вдалося записати витрату.',
    onSaved: (result) => onSaved(operationMessage(result, 'Витрату записано. Залишок оновлено.')),
  });
  const pair = pairOf(form.values);
  return (
    <ReferenceEditorDrawer
      titleId="fabric-issue-title"
      title="Разова витрата"
      description="Тканина без замовлення: зразки, ремонт, інше. Нестача стане видимим відʼємним залишком."
      formId="fabric-issue-form"
      paperWidth={640}
      readOnly={false}
      editLabel={null}
      saving={form.saving}
      submitLabel="Записати витрату"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => void form.save()}
    >
      <Stack sx={{ gap: 2 }}>
        {form.message && <Alert severity="error">{form.message}</Alert>}
        <FabricIssueForm
          values={form.values}
          errors={form.errors}
          fabrics={fabrics}
          pair={pair}
          after={balanceAfterIssue(form.values, pair)}
          disabled={form.saving}
          onChange={form.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

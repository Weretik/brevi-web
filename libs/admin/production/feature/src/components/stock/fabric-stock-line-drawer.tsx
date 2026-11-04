import {
  useGetFabricStockLineQuery,
  useReverseFabricMovementMutation,
} from '@admin/production/data-access';
import { fabricMovementKindLabels } from '@admin/production/model';
import {
  FabricMovementsTable,
  FabricStockLineDetails,
  ProductionReasonDialog,
} from '@admin/production/ui';
import { ReferenceEditorDrawer, ReferenceFormSection } from '@admin/references/ui';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';

import { useStockReason } from '../../hooks/stock/use-stock-reason';

import type { FabricMovement, FabricStockRow } from '@admin/production/model';

interface Props {
  row: FabricStockRow;
  onClose: () => void;
  onReceipt: (line: FabricStockRow) => void;
  onCorrect: (line: FabricStockRow) => void;
  onMessage: (message: string) => void;
}

/** The card of a stock line: balance, reservation and every movement. */
export function FabricStockLineDrawer({ row, onClose, onReceipt, onCorrect, onMessage }: Props) {
  const id = row.id;
  const { data, isFetching, error } = useGetFabricStockLineQuery(id ?? 0, { skip: id === null });
  const [reverse] = useReverseFabricMovementMutation();
  const reversal = useStockReason<FabricMovement>(
    (movement, note) =>
      reverse({
        id: id ?? 0,
        movementId: movement.id,
        version: data?.line.version ?? row.version,
        note,
      }).unwrap(),
    onMessage,
    'Не вдалося сторнувати рух.',
  );
  const line = data?.line ?? row;
  const canMove = Boolean(data?.permissions.canMove && id !== null);
  return (
    <ReferenceEditorDrawer
      titleId="fabric-stock-line-title"
      title={`${row.fabricCode} · ${row.fabricName}`}
      description={`Колір: ${row.color}`}
      formId="fabric-stock-line"
      paperWidth={760}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <Stack sx={{ gap: 2 }}>
        {id === null && (
          <Alert severity="warning">
            Цього кольору ще немає на складі, а відкриті завдання його потребують. Внесіть прихід.
          </Alert>
        )}
        {error && <Alert severity="error">Не вдалося завантажити картку тканини.</Alert>}
        {isFetching && <LinearProgress />}
        {canMove && (
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button variant="contained" onClick={() => onReceipt(line)}>
              Прихід
            </Button>
            <Button variant="outlined" onClick={() => onCorrect(line)}>
              Коригування
            </Button>
          </Stack>
        )}
        {data && <FabricStockLineDetails line={data} />}
        {data && (
          <ReferenceFormSection title="Рухи">
            <FabricMovementsTable
              movements={data.movements}
              busy={reversal.busy}
              onReverse={canMove ? reversal.request : undefined}
            />
          </ReferenceFormSection>
        )}
      </Stack>
      <ProductionReasonDialog
        open={reversal.pending !== null}
        title="Сторнувати рух?"
        text={
          reversal.pending
            ? `${fabricMovementKindLabels[reversal.pending.kind]} буде скасовано зворотним рухом. Сам рух залишиться в історії.`
            : ''
        }
        confirmLabel="Сторнувати"
        reason={reversal.reason}
        error={reversal.error}
        busy={reversal.busy}
        onChange={reversal.change}
        onClose={reversal.cancel}
        onConfirm={() => void reversal.confirm()}
      />
    </ReferenceEditorDrawer>
  );
}

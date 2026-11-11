import { ReferenceEditorDrawer } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import {
  useGetFabricMovementHistoryQuery,
  useRestoreFabricMovementMutation,
} from '@admin/warehouse/data-access';
import { FabricMovementHistoryTable } from '@admin/warehouse/ui';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';
import { useState } from 'react';

import { operationMessage } from '../../hooks/operations/use-stock-operation';

import type { FabricMovementRow } from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  /** «Скасувати останню правку» for people who may move stock. */
  canMove: boolean;
  onClose: () => void;
  onRestored: (message: string) => void;
}

/**
 * «Історія правок» of one movement. «Скасувати останню правку» is offered only while the server allows it: the
 * movement still is what the last edit or void left.
 */
export function FabricMovementHistoryDrawer({ row, canMove, onClose, onRestored }: Props) {
  const history = useGetFabricMovementHistoryQuery(row.id);
  const [restore] = useRestoreFabricMovementMutation();
  const [operationId, setOperationId] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function restoreLast() {
    if (!history.data || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await restore({
        movementId: row.id,
        body: { operationId, expectedRevision: history.data.revision },
      }).unwrap();
      setOperationId(crypto.randomUUID());
      onRestored(operationMessage(result, 'Останню правку скасовано. Залишки перераховано.'));
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося скасувати правку.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ReferenceEditorDrawer
      titleId="fabric-movement-history-title"
      title="Історія правок"
      description={`${row.fabricName}, ${row.fabricCode} · ${row.color}. Значення до і після кожної правки.`}
      formId="fabric-movement-history"
      paperWidth={720}
      readOnly
      editLabel={null}
      saving={busy}
      readActions={
        canMove && history.data?.canRestore ? (
          <Button variant="contained" disabled={busy} onClick={() => void restoreLast()}>
            {busy ? 'Скасовую…' : 'Скасувати останню правку'}
          </Button>
        ) : null
      }
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <Stack sx={{ gap: 2 }}>
        {history.isFetching && <LinearProgress />}
        {history.error && <Alert severity="error">Не вдалося завантажити історію правок.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {history.data && <FabricMovementHistoryTable revisions={history.data.revisions} />}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

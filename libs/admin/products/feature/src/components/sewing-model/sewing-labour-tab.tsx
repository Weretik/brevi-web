import { sewingLabourLines } from '@admin/products/model';
import { SewingLabourTable, SewingLineDeleteDialog } from '@admin/products/ui';
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack } from '@mui/material';

import { SewingModelState } from './sewing-model-state';
import { SewingOperationDrawer } from './sewing-operation-drawer';
import { useSewingLinePanel } from '../../hooks/sewing-model/use-sewing-line-panel';

import type { SewingModel } from '../../hooks/sewing-model/use-sewing-model';
import type { SewingModelWrites } from '../../hooks/sewing-model/use-sewing-model-writes';

interface Props {
  model: SewingModel;
  writes: SewingModelWrites;
  /** Seamstress pay of one minute; null until a fabric has a live price. */
  seamstressPerMinute: number | null;
}

/** «Трудовитрати»: operations of the model with time and pay; add or change in a side panel. */
export function SewingLabourTab({ model, writes, seamstressPerMinute }: Props) {
  const lines = useSewingLinePanel<string>();
  const state = <SewingModelState model={model} label="Завантаження трудовитрат" />;
  if (model.error || !model.draft) return state;
  const operations = model.draft.operations;
  const norms = model.operations.map((line) => ({
    id: line.operationId,
    name: line.name ?? `Операція ${line.operationId}`,
    min: line.normMinutes,
  }));
  const rows = sewingLabourLines(operations, norms, seamstressPerMinute);
  const open = lines.panel;
  const operation =
    open && open.key !== 'new'
      ? (operations.find((item) => item.clientId === open.key) ?? null)
      : null;
  const deleting = rows.find((row) => row.key === lines.deleting) ?? null;

  return (
    <Stack sx={{ gap: 2 }}>
      {model.canManage && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              writes.clearError();
              lines.add();
            }}
          >
            Додати операцію
          </Button>
        </Stack>
      )}
      <SewingLabourTable
        lines={rows}
        costsKnown={seamstressPerMinute !== null}
        canManage={model.canManage}
        busy={writes.busy}
        onOpen={(key) => {
          writes.clearError();
          lines.view(key);
        }}
        onEdit={(key) => {
          writes.clearError();
          lines.edit(key);
        }}
        onDelete={(key) => {
          writes.clearError();
          lines.askDelete(key);
        }}
      />
      {open && (open.key === 'new' || operation) && (
        <SewingOperationDrawer
          key={`${open.key}:${open.readOnly}`}
          operation={operation}
          operations={operations}
          readOnly={open.readOnly || !model.canManage}
          saving={writes.busy}
          error={writes.error}
          onEdit={() => operation && model.canManage && lines.edit(operation.clientId)}
          onClose={lines.close}
          onSave={writes.saveOperations}
        />
      )}
      <SewingLineDeleteDialog
        name={deleting?.name ?? null}
        deleting={writes.busy}
        error={writes.error}
        onClose={lines.cancelDelete}
        onConfirm={() => {
          if (!deleting) return;
          void writes
            .saveOperations(operations.filter((item) => item.clientId !== deleting.key))
            .then((done) => done && lines.cancelDelete());
        }}
      />
    </Stack>
  );
}

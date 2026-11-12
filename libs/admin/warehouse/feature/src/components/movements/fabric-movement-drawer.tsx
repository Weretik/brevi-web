import { ReferenceEditorDrawer } from '@admin/references/ui';
import { movementOperationLabel } from '@admin/warehouse/model';
import { FabricMovementDetails } from '@admin/warehouse/ui';
import { Button } from '@mui/material';

import { movementCancelModes } from '../../hooks/movements/use-movement-cancel';

import type { FabricMovementRow } from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  /** «Редагувати» and «Відмінити операцію…» for people who may move stock. */
  canMove: boolean;
  onClose: () => void;
  onEdit: (row: FabricMovementRow) => void;
  onCancel: (row: FabricMovementRow) => void;
  onHistory: (row: FabricMovementRow) => void;
}

/** A journal row opened: its details, «Історія правок» once changed, and the actions the row allows. */
export function FabricMovementDrawer({
  row,
  canMove,
  onClose,
  onEdit,
  onCancel,
  onHistory,
}: Props) {
  const editable = canMove && row.canEdit && !row.isVoided;
  const cancellable = canMove && movementCancelModes(row).length > 0;
  return (
    <ReferenceEditorDrawer
      titleId="fabric-movement-title"
      title={movementOperationLabel(row)}
      description={`${row.fabricName} · ${row.color}`}
      formId="fabric-movement"
      paperWidth={560}
      readOnly
      saving={false}
      editLabel={editable ? 'Редагувати' : null}
      readActions={
        <>
          {row.revision > 0 && <Button onClick={() => onHistory(row)}>Історія правок</Button>}
          {cancellable && (
            <Button color="error" variant="outlined" onClick={() => onCancel(row)}>
              Відмінити операцію…
            </Button>
          )}
        </>
      }
      onClose={onClose}
      onEdit={() => onEdit(row)}
      onSubmit={() => undefined}
    >
      <FabricMovementDetails row={row} />
    </ReferenceEditorDrawer>
  );
}

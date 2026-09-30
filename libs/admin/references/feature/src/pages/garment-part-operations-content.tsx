import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { GarmentPartOperationDeleteDialog } from '../components/garment-part-operations/garment-part-operation-delete-dialog';
import { GarmentPartOperationDialog } from '../components/garment-part-operations/garment-part-operation-dialog';
import { GarmentPartOperationsGrid } from '../components/garment-part-operations/garment-part-operations-grid';
import { useGarmentPartOperationDeletion } from '../hooks/use-garment-part-operation-deletion';
import { useGarmentPartOperations } from '../hooks/use-garment-part-operations';
import { useGarmentParts } from '../hooks/use-garment-parts';
import { useReferenceRowSelection } from '../hooks/use-reference-row-selection';

import type { GarmentPartOperationActionResult } from '../hooks/use-garment-part-operation-deletion';
import type { GarmentPartOperationDialogMode } from '../hooks/use-garment-part-operation-editor';
import type { GarmentPartOperation } from '@admin/references/data-access';

export function GarmentPartOperationsContent() {
  const { rows, loading, error, reload } = useGarmentPartOperations();
  const {
    rows: garmentParts,
    loading: partsLoading,
    error: partsError,
    reload: reloadParts,
  } = useGarmentParts();
  const [active, setActive] = useState<{
    mode: GarmentPartOperationDialogMode;
    operation: GarmentPartOperation | null;
  } | null>(null);
  const [actionResult, setActionResult] = useState<GarmentPartOperationActionResult | null>(null);
  const { selection, setSelection, selectedIds, retainFailedDeletes } = useReferenceRowSelection();
  const { pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } =
    useGarmentPartOperationDeletion(reload, setActionResult, retainFailedDeletes);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'flex-end', gap: 1, mb: 2 }}
      >
        <Button
          color="error"
          disabled={!selectedIds.length}
          onClick={() => requestDelete(selectedIds)}
        >
          Видалити вибрані ({selectedIds.length})
        </Button>
        <Button
          variant="contained"
          disabled={loading || Boolean(error) || partsLoading || Boolean(partsError)}
          onClick={() => setActive({ mode: 'create', operation: null })}
        >
          Створити
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
        </Alert>
      )}
      {partsError && (
        <Alert severity="error" action={<Button onClick={reloadParts}>Повторити елементи</Button>}>
          Не вдалося завантажити елементи для форми: {partsError}
        </Alert>
      )}
      {actionResult && (
        <Alert severity={actionResult.severity} onClose={() => setActionResult(null)}>
          {actionResult.message}
        </Alert>
      )}
      <GarmentPartOperationsGrid
        rows={rows}
        loading={loading}
        selection={selection}
        onSelectionChange={setSelection}
        onView={(operation) => setActive({ mode: 'view', operation })}
        onEdit={(operation) => setActive({ mode: 'edit', operation })}
        onDelete={(id) => requestDelete([id])}
      />
      {active && (
        <GarmentPartOperationDialog
          key={`${active.mode}-${active.operation?.id ?? 'new'}`}
          mode={active.mode}
          operation={active.operation}
          garmentParts={garmentParts}
          nextId={nextId}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionResult({ message: 'Роботу збережено.', severity: 'success' });
            reload();
          }}
        />
      )}
      <GarmentPartOperationDeleteDialog
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}

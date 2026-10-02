import { GarmentPartOperationDeleteDialog, GarmentPartOperationsGrid } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { GarmentPartOperationDrawer } from '../../components/garment-part-operations/garment-part-operation-drawer';
import { useGarmentPartOperationDeletion } from '../../hooks/garment-part-operations/use-garment-part-operation-deletion';
import { useGarmentPartOperations } from '../../hooks/garment-part-operations/use-garment-part-operations';
import { useGarmentParts } from '../../hooks/garment-parts/use-garment-parts';
import { useReferenceRowSelection } from '../../hooks/garment-parts/use-reference-row-selection';

import type { GarmentPartOperationActionResult } from '../../hooks/garment-part-operations/use-garment-part-operation-deletion';
import type { GarmentPartOperationEditorMode } from '../../hooks/garment-part-operations/use-garment-part-operation-editor';
import type { GarmentPartOperation } from '@admin/references/model';

interface ActiveEditor {
  mode: GarmentPartOperationEditorMode;
  operation: GarmentPartOperation | null;
}

export function GarmentPartOperationsContent() {
  const { rows, loading, error, reload } = useGarmentPartOperations();
  const {
    rows: garmentParts,
    loading: garmentPartsLoading,
    error: garmentPartsError,
    reload: reloadGarmentParts,
  } = useGarmentParts();
  const [actionResult, setActionResult] = useState<GarmentPartOperationActionResult | null>(null);
  const [activeEditor, setActiveEditor] = useState<ActiveEditor | null>(null);
  const { selection, setSelection, selectedIds, retainFailedDeletes } = useReferenceRowSelection();
  const { pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } =
    useGarmentPartOperationDeletion(setActionResult, retainFailedDeletes);

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
          disabled={loading || Boolean(error)}
          onClick={() => setActiveEditor({ mode: 'create', operation: null })}
        >
          Створити
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
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
        onView={(operation) => setActiveEditor({ mode: 'view', operation })}
        onEdit={(operation) => setActiveEditor({ mode: 'edit', operation })}
        onDelete={(id) => requestDelete([id])}
      />
      {activeEditor && (
        <GarmentPartOperationDrawer
          key={`${activeEditor.mode}-${activeEditor.operation?.id ?? 'new'}`}
          mode={activeEditor.mode}
          operation={activeEditor.operation}
          garmentParts={garmentParts}
          garmentPartsLoading={garmentPartsLoading}
          garmentPartsError={garmentPartsError}
          nextId={Math.max(0, ...rows.map(({ id }) => id)) + 1}
          onRetryGarmentParts={reloadGarmentParts}
          onClose={() => setActiveEditor(null)}
          onSaved={() => {
            setActiveEditor(null);
            setActionResult({ message: 'Роботу збережено.', severity: 'success' });
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

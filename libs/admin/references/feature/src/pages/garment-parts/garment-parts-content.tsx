import { GarmentPartDeleteDialog, GarmentPartsGrid } from '@admin/references/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { GarmentPartDrawer } from '../../components/garment-parts/garment-part-drawer';
import { useGarmentPartDeletion } from '../../hooks/garment-parts/use-garment-part-deletion';
import { useGarmentParts } from '../../hooks/garment-parts/use-garment-parts';
import { useReferenceRowSelection } from '../../hooks/garment-parts/use-reference-row-selection';

import type { GarmentPartActionResult } from '../../hooks/garment-parts/use-garment-part-deletion';
import type { GarmentPartEditorMode } from '../../hooks/garment-parts/use-garment-part-editor';
import type { GarmentPart } from '@admin/references/model';

interface ActiveEditor {
  mode: GarmentPartEditorMode;
  garmentPart: GarmentPart | null;
}

export function GarmentPartsContent() {
  const { rows, loading, error, reload } = useGarmentParts();
  const [actionResult, setActionResult] = useState<GarmentPartActionResult | null>(null);
  const [activeEditor, setActiveEditor] = useState<ActiveEditor | null>(null);
  const { selection, setSelection, selectedIds, retainFailedDeletes } = useReferenceRowSelection();
  const { pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } =
    useGarmentPartDeletion(setActionResult, retainFailedDeletes);

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
          onClick={() => setActiveEditor({ mode: 'create', garmentPart: null })}
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
      <GarmentPartsGrid
        rows={rows}
        loading={loading}
        selection={selection}
        onSelectionChange={setSelection}
        onView={(garmentPart) => setActiveEditor({ mode: 'view', garmentPart })}
        onEdit={(garmentPart) => setActiveEditor({ mode: 'edit', garmentPart })}
        onDelete={(id) => requestDelete([id])}
      />
      {activeEditor && (
        <GarmentPartDrawer
          key={`${activeEditor.mode}-${activeEditor.garmentPart?.id ?? 'new'}`}
          mode={activeEditor.mode}
          garmentPart={activeEditor.garmentPart}
          nextId={Math.max(0, ...rows.map(({ id }) => id)) + 1}
          onClose={() => setActiveEditor(null)}
          onSaved={() => {
            setActiveEditor(null);
            setActionResult({ message: 'Елемент виробу збережено.', severity: 'success' });
          }}
        />
      )}
      <GarmentPartDeleteDialog
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}

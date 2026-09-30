import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { GarmentPartDeleteDialog } from '../components/garment-parts/garment-part-delete-dialog';
import { GarmentPartDialog } from '../components/garment-parts/garment-part-dialog';
import { GarmentPartsGrid } from '../components/garment-parts/garment-parts-grid';
import { useGarmentPartDeletion } from '../hooks/use-garment-part-deletion';
import { useGarmentParts } from '../hooks/use-garment-parts';
import { useReferenceRowSelection } from '../hooks/use-reference-row-selection';

import type { GarmentPartActionResult } from '../hooks/use-garment-part-deletion';
import type { GarmentPartDialogMode } from '../hooks/use-garment-part-editor';
import type { GarmentPart } from '@admin/references/data-access';

export function GarmentPartsContent() {
  const { rows, loading, error, reload } = useGarmentParts();
  const [active, setActive] = useState<{
    mode: GarmentPartDialogMode;
    garmentPart: GarmentPart | null;
  } | null>(null);
  const [actionResult, setActionResult] = useState<GarmentPartActionResult | null>(null);
  const { selection, setSelection, selectedIds, retainFailedDeletes } = useReferenceRowSelection();
  const { pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } =
    useGarmentPartDeletion(reload, setActionResult, retainFailedDeletes);
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
          disabled={loading || Boolean(error)}
          onClick={() => setActive({ mode: 'create', garmentPart: null })}
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
        onView={(garmentPart) => setActive({ mode: 'view', garmentPart })}
        onEdit={(garmentPart) => setActive({ mode: 'edit', garmentPart })}
        onDelete={(id) => requestDelete([id])}
      />
      {active && (
        <GarmentPartDialog
          key={`${active.mode}-${active.garmentPart?.id ?? 'new'}`}
          mode={active.mode}
          garmentPart={active.garmentPart}
          nextId={nextId}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionResult({ message: 'Елемент виробу збережено.', severity: 'success' });
            reload();
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

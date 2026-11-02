import {
  GarmentPartDeleteDialog,
  GarmentPartsGrid,
  ReferenceBulkDeleteButton,
  ReferencePageHeader,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, Paper, Stack } from '@mui/material';
import { useState } from 'react';

import { GarmentPartDrawer } from '../../components/garment-parts/garment-part-drawer';
import { useGarmentPartDeletion } from '../../hooks/garment-parts/use-garment-part-deletion';
import { useGarmentParts } from '../../hooks/garment-parts/use-garment-parts';
import { useReferenceRowSelection } from '../../hooks/garment-parts/use-reference-row-selection';

import type { GarmentPartActionResult } from '../../hooks/garment-parts/use-garment-part-deletion';
import type { GarmentPartEditorMode } from '../../hooks/garment-parts/use-garment-part-editor';
import type { GarmentPart } from '@admin/references/model';
import type { ReactNode } from 'react';

interface ActiveEditor {
  mode: GarmentPartEditorMode;
  garmentPart: GarmentPart | null;
}

interface Props {
  /** The «Операції / Групи деталей» switch shown under the header. */
  tabs: ReactNode;
}

/** «Група деталей» list; a group that still has operations cannot be deleted. */
export function GarmentPartsContent({ tabs }: Props) {
  const { rows, loading, error, reload } = useGarmentParts();
  const [actionResult, setActionResult] = useState<GarmentPartActionResult | null>(null);
  const [activeEditor, setActiveEditor] = useState<ActiveEditor | null>(null);
  const { selection, setSelection, selectedIds, retainFailedDeletes } = useReferenceRowSelection();
  const { pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } =
    useGarmentPartDeletion(setActionResult, retainFailedDeletes);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Операції"
        subtitle="Групи деталей, до яких належать операції"
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={selectedIds.length}
              disabled={deleting || loading}
              onDelete={() => requestDelete(selectedIds)}
            />
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActiveEditor({ mode: 'create', garmentPart: null })}
            >
              Додати групу
            </Button>
          </>
        }
      />
      {tabs}
      <Stack sx={{ gap: 1, mb: error || actionResult ? 2 : 0 }}>
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
      </Stack>
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <GarmentPartsGrid
          rows={rows}
          loading={loading}
          selection={selection}
          onSelectionChange={setSelection}
          onView={(garmentPart) => setActiveEditor({ mode: 'view', garmentPart })}
          onEdit={(garmentPart) => setActiveEditor({ mode: 'edit', garmentPart })}
          onDelete={(id) => requestDelete([id])}
        />
      </Paper>
      {activeEditor && (
        <GarmentPartDrawer
          key={`${activeEditor.mode}-${activeEditor.garmentPart?.id ?? 'new'}`}
          mode={activeEditor.mode}
          garmentPart={activeEditor.garmentPart}
          nextId={Math.max(0, ...rows.map(({ id }) => id)) + 1}
          onClose={() => setActiveEditor(null)}
          onSaved={() => {
            setActiveEditor(null);
            setActionResult({ message: 'Групу збережено.', severity: 'success' });
          }}
        />
      )}
      <GarmentPartDeleteDialog
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </Box>
  );
}

import { GarmentAccessoriesGrid, GarmentAccessoryDeleteDialog } from '@admin/references/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { GarmentAccessoryDrawer } from '../../components/garment-accessories/garment-accessory-drawer';
import { useGarmentAccessories } from '../../hooks/garment-accessories/use-garment-accessories';
import { useGarmentAccessoryDeletion } from '../../hooks/garment-accessories/use-garment-accessory-deletion';

import type { GarmentAccessoryEditorMode } from '../../hooks/garment-accessories/use-garment-accessory-editor';
import type { GarmentAccessory } from '@admin/references/model';

export function GarmentAccessoriesContent() {
  const { rows, loading, error, reload } = useGarmentAccessories();
  const [active, setActive] = useState<{
    mode: GarmentAccessoryEditorMode;
    accessory: GarmentAccessory | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const {
    selection,
    setSelection,
    selectedIds,
    pendingDeleteIds,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useGarmentAccessoryDeletion(setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', gap: 2, my: 2 }}
      >
        <Typography variant="h6">Фурнітура виробу</Typography>
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
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
            onClick={() => setActive({ mode: 'create', accessory: null })}
          >
            Створити
          </Button>
        </Stack>
      </Stack>
      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
        </Alert>
      )}
      {actionMessage && (
        <Alert
          severity={actionMessage.startsWith('Не вдалося') ? 'error' : 'success'}
          onClose={() => setActionMessage(null)}
        >
          {actionMessage}
        </Alert>
      )}
      <GarmentAccessoriesGrid
        rows={rows}
        loading={loading}
        selection={selection}
        onSelectionChange={setSelection}
        onView={(accessory) => setActive({ mode: 'view', accessory })}
        onEdit={(accessory) => setActive({ mode: 'edit', accessory })}
        onDelete={(id) => requestDelete([id])}
      />
      {active && (
        <GarmentAccessoryDrawer
          key={`${active.mode}-${active.accessory?.id ?? 'new'}`}
          mode={active.mode}
          accessory={active.accessory}
          nextId={nextId}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Фурнітуру збережено.');
          }}
        />
      )}
      <GarmentAccessoryDeleteDialog
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}

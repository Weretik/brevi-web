import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { GarmentAccessoriesGrid } from '../components/garment-accessories/garment-accessories-grid';
import { GarmentAccessoryDeleteDialog } from '../components/garment-accessories/garment-accessory-delete-dialog';
import { GarmentAccessoryDialog } from '../components/garment-accessories/garment-accessory-dialog';
import { useGarmentAccessories } from '../hooks/use-garment-accessories';
import { useGarmentAccessoryDeletion } from '../hooks/use-garment-accessory-deletion';

import type { GarmentAccessoryDialogMode } from '../hooks/use-garment-accessory-editor';
import type { GarmentAccessory } from '@admin/references/data-access';

export function GarmentAccessoriesContent() {
  const { rows, loading, error, reload } = useGarmentAccessories();
  const [active, setActive] = useState<{ mode: GarmentAccessoryDialogMode; accessory: GarmentAccessory | null } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const { selection, setSelection, selectedIds, pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } = useGarmentAccessoryDeletion(reload, setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return <>
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2, my: 2 }}>
      <Typography variant="h6">Фурнітура виробу</Typography>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
        <Button color="error" disabled={!selectedIds.length} onClick={() => requestDelete(selectedIds)}>Видалити вибрані ({selectedIds.length})</Button>
        <Button variant="contained" onClick={() => setActive({ mode: 'create', accessory: null })}>Створити</Button>
      </Stack>
    </Stack>
    {error && <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>{error}</Alert>}
    {actionMessage && <Alert severity={actionMessage.startsWith('Не вдалося') ? 'error' : 'success'} onClose={() => setActionMessage(null)}>{actionMessage}</Alert>}
    <GarmentAccessoriesGrid rows={rows} loading={loading} selection={selection} onSelectionChange={setSelection} onView={(accessory) => setActive({ mode: 'view', accessory })} onEdit={(accessory) => setActive({ mode: 'edit', accessory })} onDelete={(id) => requestDelete([id])} />
    {active && <GarmentAccessoryDialog key={`${active.mode}-${active.accessory?.id ?? 'new'}`} mode={active.mode} accessory={active.accessory} nextId={nextId} onClose={() => setActive(null)} onSaved={() => { setActive(null); setActionMessage('Фурнітуру збережено.'); reload(); }} />}
    <GarmentAccessoryDeleteDialog ids={pendingDeleteIds} deleting={deleting} onClose={cancelDelete} onConfirm={() => void confirmDelete()} />
  </>;
}

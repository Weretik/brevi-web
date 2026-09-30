import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { FabricDeleteDialog } from '../components/fabrics/fabric-delete-dialog';
import { FabricDialog } from '../components/fabrics/fabric-dialog';
import { FabricsGrid } from '../components/fabrics/fabrics-grid';
import { useFabricDeletion } from '../hooks/use-fabric-deletion';
import { useFabrics } from '../hooks/use-fabrics';

import type { FabricDialogMode } from '../hooks/use-fabric-editor';
import type { Fabric } from '@admin/references/data-access';

export function FabricsPage() {
  const { rows, loading, error, reload } = useFabrics();
  const [active, setActive] = useState<{ mode: FabricDialogMode; fabric: Fabric | null } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const { selection, setSelection, selectedIds, pendingDeleteIds, deleting, requestDelete, cancelDelete, confirmDelete } = useFabricDeletion(reload, setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return <>
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2, my: 2 }}>
      <Typography variant="h6">Тканини</Typography>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
        <Button color="error" disabled={!selectedIds.length} onClick={() => requestDelete(selectedIds)}>Видалити вибрані ({selectedIds.length})</Button>
        <Button variant="contained" disabled={loading || Boolean(error)} onClick={() => setActive({ mode: 'create', fabric: null })}>Створити</Button>
      </Stack>
    </Stack>
    {error && <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>{error}</Alert>}
    {actionMessage && <Alert severity={actionMessage.startsWith('Не вдалося') ? 'error' : 'success'} onClose={() => setActionMessage(null)}>{actionMessage}</Alert>}
    <Box sx={{ minWidth: 0 }}>
      <FabricsGrid rows={rows} loading={loading} selection={selection} onSelectionChange={setSelection} onView={(fabric) => setActive({ mode: 'view', fabric })} onEdit={(fabric) => setActive({ mode: 'edit', fabric })} onDelete={(id) => requestDelete([id])} />
    </Box>
    {active && <FabricDialog key={`${active.mode}-${active.fabric?.id ?? 'new'}`} mode={active.mode} fabric={active.fabric} nextId={nextId} onClose={() => setActive(null)} onSaved={() => { setActive(null); setActionMessage('Тканину збережено.'); reload(); }} />}
    <FabricDeleteDialog ids={pendingDeleteIds} deleting={deleting} onClose={cancelDelete} onConfirm={() => void confirmDelete()} />
  </>;
}

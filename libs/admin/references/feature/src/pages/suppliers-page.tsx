import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { SupplierDeleteDialog } from '../components/suppliers/supplier-delete-dialog';
import { SupplierDialog } from '../components/suppliers/supplier-dialog';
import { SuppliersGrid } from '../components/suppliers/suppliers-grid';
import { useSupplierDeletion } from '../hooks/use-supplier-deletion';
import { useSuppliers } from '../hooks/use-suppliers';

import type { SupplierDialogMode } from '../hooks/use-supplier-editor';
import type { Supplier } from '@admin/references/data-access';

export function SuppliersPage() {
  const { rows, loading, error, reload } = useSuppliers();
  const [active, setActive] = useState<{
    mode: SupplierDialogMode;
    supplier: Supplier | null;
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
  } = useSupplierDeletion(reload, setActionMessage);

  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', gap: 2, mb: 2 }}
      >
        <Typography variant="h4" component="h1">
          Постачальники
        </Typography>
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Button
            color="error"
            disabled={!selectedIds.length}
            onClick={() => requestDelete(selectedIds)}
          >
            Видалити вибрані ({selectedIds.length})
          </Button>
          <Button variant="contained" onClick={() => setActive({ mode: 'create', supplier: null })}>
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
      <SuppliersGrid
        rows={rows}
        loading={loading}
        selection={selection}
        onSelectionChange={setSelection}
        onView={(supplier) => setActive({ mode: 'view', supplier })}
        onEdit={(supplier) => setActive({ mode: 'edit', supplier })}
        onDelete={(id) => requestDelete([id])}
      />
      {active && (
        <SupplierDialog
          key={`${active.mode}-${active.supplier?.id ?? 'new'}`}
          mode={active.mode}
          supplier={active.supplier}
          nextId={nextId}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Постачальника збережено.');
            reload();
          }}
        />
      )}
      <SupplierDeleteDialog
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </Box>
  );
}

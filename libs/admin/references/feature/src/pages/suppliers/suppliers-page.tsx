import { SupplierDeleteDialog, SuppliersGrid, SuppliersToolbar } from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { SupplierDialog } from '../../components/suppliers/supplier-dialog';
import { useSupplierDeletion } from '../../hooks/suppliers/use-supplier-deletion';
import { useSuppliers } from '../../hooks/suppliers/use-suppliers';

import type { Supplier, SupplierDialogMode } from '@admin/references/model';

export function SuppliersPage() {
  const { rows, loading, error, reload } = useSuppliers();
  const [active, setActive] = useState<{
    mode: SupplierDialogMode;
    supplier: Supplier | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const query = search.trim().toLocaleLowerCase('uk');
  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        [row.name, row.contactPerson, row.phoneNumber].some((value) =>
          value?.toLocaleLowerCase('uk').includes(query),
        ),
      ),
    [rows, query],
  );
  const {
    selection,
    setSelection,
    selectedIds,
    pendingDeleteIds,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useSupplierDeletion(setActionMessage);

  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 2.5 }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Довідники
          </Typography>
          <Typography variant="h1">Постачальники</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Контакти та інформація про постачальників
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={() => setActive({ mode: 'create', supplier: null })}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Додати постачальника
        </Button>
      </Stack>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button disabled={loading} onClick={() => void reload()}>
              Повторити
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {actionMessage && (
        <Alert
          severity={actionMessage.startsWith('Не вдалося') ? 'error' : 'success'}
          onClose={() => setActionMessage(null)}
          sx={{ mb: 2 }}
        >
          {actionMessage}
        </Alert>
      )}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <SuppliersToolbar
          search={search}
          onSearchChange={setSearch}
          count={filteredRows.length}
          total={rows.length}
          selectedCount={selectedIds.length}
          loading={loading}
          deleting={deleting}
          onReload={() => void reload()}
          onDelete={() => requestDelete(selectedIds)}
        />
        <SuppliersGrid
          rows={filteredRows}
          loading={loading}
          searching={Boolean(query)}
          unavailable={Boolean(error)}
          selection={selection}
          onSelectionChange={setSelection}
          onView={(supplier) => setActive({ mode: 'view', supplier })}
          onEdit={(supplier) => setActive({ mode: 'edit', supplier })}
          onDelete={(id) => requestDelete([id])}
        />
      </Paper>
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

export default SuppliersPage;

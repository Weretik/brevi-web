import { filterSuppliers, lastSupplierKeepinSync } from '@admin/references/model';
import { SupplierDeleteDialog, SuppliersGrid, SuppliersToolbar } from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { SupplierDialog } from '../../components/suppliers/supplier-dialog';
import { useSupplierDeletion } from '../../hooks/suppliers/use-supplier-deletion';
import { useSupplierKeepinSync } from '../../hooks/suppliers/use-supplier-keepin-sync';
import { useSuppliers } from '../../hooks/suppliers/use-suppliers';

import type { Supplier, SupplierActivityFilter, SupplierDialogMode } from '@admin/references/model';

export function SuppliersPage() {
  const { rows, loading, error, reload } = useSuppliers();
  const [active, setActive] = useState<{
    mode: SupplierDialogMode;
    supplier: Supplier | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activity, setActivity] = useState<SupplierActivityFilter>('active');
  const filteredRows = useMemo(
    () => filterSuppliers(rows, search, activity),
    [rows, search, activity],
  );
  const activityCounts = useMemo(
    () => ({
      active: rows.filter((row) => row.isActive).length,
      inactive: rows.filter((row) => !row.isActive).length,
      all: rows.length,
    }),
    [rows],
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
  const [syncNotice, setSyncNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const { sync, syncing } = useSupplierKeepinSync((text, ok) => setSyncNotice({ text, ok }));
  const lastSync = lastSupplierKeepinSync(rows);

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
            {lastSync ? (
              <>
                Картки оновлюються з KeepinCRM щодня. Останнє оновлення:{' '}
                <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                  {new Date(lastSync).toLocaleString('uk-UA', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </Box>
              </>
            ) : (
              'Контакти та інформація про постачальників'
            )}
          </Typography>
        </Box>
        <Stack
          direction="row"
          sx={{ gap: 1, flexWrap: 'wrap', alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          <Button
            variant="outlined"
            startIcon={<SyncOutlinedIcon />}
            disabled={syncing}
            onClick={() => void sync()}
          >
            {syncing ? 'Оновлення…' : 'Оновити з KeepinCRM'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setActive({ mode: 'create', supplier: null })}
          >
            Додати постачальника
          </Button>
        </Stack>
      </Stack>
      {syncNotice && (
        <Alert
          severity={syncNotice.ok ? 'success' : 'error'}
          onClose={() => setSyncNotice(null)}
          sx={{ mb: 2 }}
        >
          {syncNotice.text}
        </Alert>
      )}
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
          activity={activity}
          activityCounts={activityCounts}
          onActivityChange={setActivity}
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
          searching={rows.length > 0}
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

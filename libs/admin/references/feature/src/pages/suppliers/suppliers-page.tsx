import { filterSuppliers, lastSupplierKeepinSync } from '@admin/references/model';
import {
  ReferenceBulkDeleteButton,
  ReferenceFilterBar,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
  SupplierDeleteDialog,
  SuppliersGrid,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

import { SupplierDrawer } from '../../components/suppliers/supplier-drawer';
import { useReferenceListFilters } from '../../hooks/reference-lists/use-reference-list-filters';
import { useSupplierDeletion } from '../../hooks/suppliers/use-supplier-deletion';
import { useSupplierKeepinSync } from '../../hooks/suppliers/use-supplier-keepin-sync';
import { useSuppliers } from '../../hooks/suppliers/use-suppliers';

import type { Supplier, SupplierDialogMode } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The page tabs shown above the header. */
  tabs?: ReactNode;
  canSeePurchaseInvoices?: boolean;
  /** A supplier to open once the list is loaded («Відкрити в контрагентах»). */
  openSupplierId?: number | null;
  /** Called once the requested supplier is handled, so the page can drop it from the URL. */
  onSupplierOpened?: () => void;
}

/** «Контрагенти → Постачальники». */
export function SuppliersPage({
  tabs,
  canSeePurchaseInvoices = false,
  openSupplierId = null,
  onSupplierOpened,
}: Props = {}) {
  const { rows, loading, error, reload } = useSuppliers();
  const [active, setActive] = useState<{
    mode: SupplierDialogMode;
    supplier: Supplier | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const filters = useReferenceListFilters(rows, filterSuppliers);
  const deletion = useSupplierDeletion(setActionMessage);

  // «Відкрити в контрагентах» from a supplier card elsewhere: open that supplier once the list is here.
  useEffect(() => {
    if (openSupplierId == null || loading) return;
    const supplier = rows.find((row) => row.id === openSupplierId);
    if (supplier) setActive({ mode: 'view', supplier });
    onSupplierOpened?.();
  }, [openSupplierId, loading, rows, onSupplierOpened]);

  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;
  const [syncNotice, setSyncNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const { sync, syncing } = useSupplierKeepinSync((text, ok) => setSyncNotice({ text, ok }));
  const lastSync = lastSupplierKeepinSync(rows);

  return (
    <Box sx={{ minWidth: 0 }}>
      {tabs}
      <ReferencePageHeader
        title="Постачальники"
        subtitle={
          lastSync ? (
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
          )
        }
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={deletion.selectedIds.length}
              disabled={deletion.deleting || loading}
              onDelete={() => deletion.requestDelete(deletion.selectedIds)}
            />
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
          </>
        }
      />
      {syncNotice && (
        <Alert
          severity={syncNotice.ok ? 'success' : 'error'}
          onClose={() => setSyncNotice(null)}
          sx={{ mb: 2 }}
        >
          {syncNotice.text}
        </Alert>
      )}
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти постачальника за назвою, контактом, телефоном або email"
        label="Пошук постачальників"
        value={filters.search}
        onChange={filters.setSearch}
      />
      <ReferenceFilterBar
        activity={filters.activity}
        activityCounts={filters.activityCounts}
        onActivityChange={filters.setActivity}
        count={filters.filteredRows.length}
        total={filters.activityTotal}
        countLabel="Кількість постачальників"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <SuppliersGrid
          rows={filters.filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(supplier) => setActive({ mode: 'view', supplier })}
          onEdit={(supplier) => setActive({ mode: 'edit', supplier })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <SupplierDrawer
          key={`${active.mode}-${active.supplier?.id ?? 'new'}`}
          mode={active.mode}
          supplier={active.supplier}
          nextId={nextId}
          canSeePurchaseInvoices={canSeePurchaseInvoices}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Постачальника збережено.');
          }}
        />
      )}
      <SupplierDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

export default SuppliersPage;

import { filterSuppliers, lastSupplierKeepinSync } from '@admin/references/model';
import {
  ReferenceFilterBar,
  ReferenceListAlerts,
  ReferenceSearchBar,
  SupplierDeleteDialog,
  SuppliersGrid,
} from '@admin/references/ui';
import { Alert, Box, Paper } from '@mui/material';
import { useState } from 'react';

import { SupplierDrawer } from '../../components/suppliers/supplier-drawer';
import { SuppliersHeader } from '../../components/suppliers/suppliers-header';
import { useReferenceListFilters } from '../../hooks/reference-lists/use-reference-list-filters';
import { useSupplierDeletion } from '../../hooks/suppliers/use-supplier-deletion';
import { useSupplierKeepinSync } from '../../hooks/suppliers/use-supplier-keepin-sync';
import { useSuppliers } from '../../hooks/suppliers/use-suppliers';

import type { Supplier, SupplierDialogMode } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The page tabs shown above the header. */
  tabs?: ReactNode;
  /** A row click opens the supplier card (CARD-001); without it the row opens the side panel to view. */
  onOpenCard?: (supplier: Supplier) => void;
}

/** «Контрагенти → Постачальники»: a row opens the supplier card (CARD-001), «Редагувати» the side panel. */
export function SuppliersPage({ tabs, onOpenCard }: Props = {}) {
  const { rows, loading, error, reload } = useSuppliers();
  const [active, setActive] = useState<{
    mode: SupplierDialogMode;
    supplier: Supplier | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const filters = useReferenceListFilters(rows, filterSuppliers);
  const deletion = useSupplierDeletion(setActionMessage);

  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;
  const [syncNotice, setSyncNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const { sync, syncing } = useSupplierKeepinSync((text, ok) => setSyncNotice({ text, ok }));
  const lastSync = lastSupplierKeepinSync(rows);

  return (
    <Box sx={{ minWidth: 0 }}>
      {tabs}
      <SuppliersHeader
        lastSync={lastSync}
        selectedCount={deletion.selectedIds.length}
        deleteDisabled={deletion.deleting || loading}
        syncing={syncing}
        onDelete={() => deletion.requestDelete(deletion.selectedIds)}
        onSync={() => void sync()}
        onCreate={() => setActive({ mode: 'create', supplier: null })}
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
          onView={(supplier) =>
            onOpenCard ? onOpenCard(supplier) : setActive({ mode: 'view', supplier })
          }
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

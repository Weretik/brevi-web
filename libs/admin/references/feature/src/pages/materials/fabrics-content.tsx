import { filterFabrics, listReferenceSuppliers } from '@admin/references/model';
import {
  FabricDeleteDialog,
  FabricsGrid,
  ReferenceBulkDeleteButton,
  ReferenceFilterBar,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
  ReferenceSupplierFilter,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { FabricDrawer } from '../../components/fabrics/fabric-drawer';
import { useSupplierPreview } from '../../components/suppliers/supplier-preview';
import { useFabricDeletion } from '../../hooks/fabrics/use-fabric-deletion';
import { useFabrics } from '../../hooks/fabrics/use-fabrics';
import { useReferenceListFilters } from '../../hooks/reference-lists/use-reference-list-filters';

import type { FabricEditorMode } from '../../hooks/fabrics/use-fabric-editor';
import type { Fabric } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The «Тканини / Фурнітура» switch shown under the header. */
  tabs: ReactNode;
}

export function FabricsContent({ tabs }: Props) {
  const { rows, loading, error, reload } = useFabrics();
  const [active, setActive] = useState<{ mode: FabricEditorMode; fabric: Fabric | null } | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const filters = useReferenceListFilters(rows, filterFabrics);
  const suppliers = useMemo(() => listReferenceSuppliers(rows, (row) => row.providerName), [rows]);
  const deletion = useFabricDeletion(setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  const supplierPreview = useSupplierPreview();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Тканини та фурнітура"
        subtitle="Тканини: ціни за 1 метр, склад і щільність для калькуляції та КП"
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={deletion.selectedIds.length}
              disabled={deletion.deleting || loading}
              onDelete={() => deletion.requestDelete(deletion.selectedIds)}
            />
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActive({ mode: 'create', fabric: null })}
            >
              Додати тканину
            </Button>
          </>
        }
      />
      {tabs}
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти тканину за кодом, назвою, складом або постачальником"
        label="Пошук тканин"
        value={filters.search}
        onChange={filters.setSearch}
      />
      <ReferenceFilterBar
        activity={filters.activity}
        activityCounts={filters.activityCounts}
        onActivityChange={filters.setActivity}
        extraFilters={
          <ReferenceSupplierFilter
            options={suppliers}
            value={filters.supplier}
            onChange={filters.setSupplier}
          />
        }
        count={filters.filteredRows.length}
        total={filters.activityTotal}
        countLabel="Кількість тканин"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FabricsGrid
          rows={filters.filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(fabric) => setActive({ mode: 'view', fabric })}
          onEdit={(fabric) => setActive({ mode: 'edit', fabric })}
          onDelete={(id) => deletion.requestDelete([id])}
          onOpenSupplier={(name) => supplierPreview.open({ name })}
        />
      </Paper>
      {supplierPreview.element}
      {active && (
        <FabricDrawer
          key={`${active.mode}-${active.fabric?.id ?? 'new'}`}
          mode={active.mode}
          fabric={active.fabric}
          nextId={nextId}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Тканину збережено.');
          }}
        />
      )}
      <FabricDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

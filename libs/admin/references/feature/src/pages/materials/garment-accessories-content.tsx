import { filterGarmentAccessories, listReferenceSuppliers } from '@admin/references/model';
import {
  GarmentAccessoryDeleteDialog,
  GarmentAccessoriesGrid,
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

import { GarmentAccessoryDrawer } from '../../components/garment-accessories/garment-accessory-drawer';
import { useGarmentAccessories } from '../../hooks/garment-accessories/use-garment-accessories';
import { useGarmentAccessoryDeletion } from '../../hooks/garment-accessories/use-garment-accessory-deletion';
import { useReferenceListFilters } from '../../hooks/reference-lists/use-reference-list-filters';

import type { GarmentAccessoryEditorMode } from '../../hooks/garment-accessories/use-garment-accessory-editor';
import type { GarmentAccessory } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The «Тканини / Фурнітура» switch shown under the header. */
  tabs: ReactNode;
}

export function GarmentAccessoriesContent({ tabs }: Props) {
  const { rows, loading, error, reload } = useGarmentAccessories();
  const [active, setActive] = useState<{
    mode: GarmentAccessoryEditorMode;
    accessory: GarmentAccessory | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const filters = useReferenceListFilters(rows, filterGarmentAccessories);
  const suppliers = useMemo(() => listReferenceSuppliers(rows, (row) => row.supplierName), [rows]);
  const deletion = useGarmentAccessoryDeletion(setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Тканини та фурнітура"
        subtitle="Фурнітура: нитки, блискавки, кнопки та послуги з цінами за одиницю"
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
              onClick={() => setActive({ mode: 'create', accessory: null })}
            >
              Додати фурнітуру
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
        placeholder="Знайти фурнітуру за кодом, назвою або постачальником"
        label="Пошук фурнітури"
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
        countLabel="Кількість фурнітури"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <GarmentAccessoriesGrid
          rows={filters.filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(accessory) => setActive({ mode: 'view', accessory })}
          onEdit={(accessory) => setActive({ mode: 'edit', accessory })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
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
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

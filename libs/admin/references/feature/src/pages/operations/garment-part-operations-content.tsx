import { filterGarmentPartOperations, listReferenceSuppliers } from '@admin/references/model';
import {
  GarmentPartOperationDeleteDialog,
  GarmentPartOperationsGrid,
  ReferenceBulkDeleteButton,
  ReferenceFilterBar,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
  ReferenceSupplierFilter,
} from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { GarmentPartOperationDrawer } from '../../components/garment-part-operations/garment-part-operation-drawer';
import { useGarmentPartOperationDeletion } from '../../hooks/garment-part-operations/use-garment-part-operation-deletion';
import { useGarmentPartOperations } from '../../hooks/garment-part-operations/use-garment-part-operations';
import { useOperationLabourRates } from '../../hooks/garment-part-operations/use-operation-labour-rates';
import { useReferenceListFilters } from '../../hooks/reference-lists/use-reference-list-filters';

import type { GarmentPartOperationEditorMode } from '../../hooks/garment-part-operations/use-garment-part-operation-editor';
import type { GarmentPartOperation } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The «Операції / Групи» switch shown under the header. */
  tabs: ReactNode;
}

export function GarmentPartOperationsContent({ tabs }: Props) {
  const { canCreate } = usePageRights();
  const { rows, loading, error, reload } = useGarmentPartOperations();
  const { rates, unavailable: ratesUnavailable } = useOperationLabourRates();
  const [active, setActive] = useState<{
    mode: GarmentPartOperationEditorMode;
    operation: GarmentPartOperation | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const filters = useReferenceListFilters(rows, filterGarmentPartOperations);
  const groups = useMemo(() => listReferenceSuppliers(rows, (row) => row.garmentPartName), [rows]);
  const deletion = useGarmentPartOperationDeletion(setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Операції"
        subtitle={
          ratesUnavailable
            ? 'Норми часу швейних операцій. Вартість недоступна: не вдалося прочитати налаштування пошиву'
            : 'Норми часу швейних операцій; вартість рахується з налаштувань пошиву'
        }
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={deletion.selectedIds.length}
              disabled={deletion.deleting || loading}
              onDelete={() => deletion.requestDelete(deletion.selectedIds)}
            />
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                disabled={loading || Boolean(error)}
                onClick={() => setActive({ mode: 'create', operation: null })}
              >
                Додати операцію
              </Button>
            )}
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
        placeholder="Знайти операцію за кодом, назвою, групою, елементом або варіантом"
        label="Пошук операцій"
        value={filters.search}
        onChange={filters.setSearch}
      />
      <ReferenceFilterBar
        activity={filters.activity}
        activityCounts={filters.activityCounts}
        onActivityChange={filters.setActivity}
        extraFilters={
          <ReferenceSupplierFilter
            label="Група"
            allLabel="Усі групи"
            emptyLabel="Без групи"
            options={groups}
            value={filters.supplier}
            onChange={filters.setSupplier}
          />
        }
        count={filters.filteredRows.length}
        total={filters.activityTotal}
        countLabel="Кількість операцій"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <GarmentPartOperationsGrid
          rows={filters.filteredRows}
          rates={rates}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(operation) => setActive({ mode: 'view', operation })}
          onEdit={(operation) => setActive({ mode: 'edit', operation })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <GarmentPartOperationDrawer
          key={`${active.mode}-${active.operation?.id ?? 'new'}`}
          mode={active.mode}
          operation={active.operation}
          rates={rates}
          nextId={nextId}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Операцію збережено.');
          }}
        />
      )}
      <GarmentPartOperationDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

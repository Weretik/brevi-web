import {
  PricingDeleteDialog,
  PricingParametersGrid,
  PricingSectionChips,
  ReferenceBulkDeleteButton,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';

import { PricingParameterDrawer } from '../../components/pricing-parameters/pricing-parameter-drawer';
import { nextSortOrder } from '../../hooks/pricing-parameters/use-pricing-lists';
import { usePricingParametersContent } from '../../hooks/pricing-parameters/use-pricing-parameters-content';

import type { ReactNode } from 'react';

interface Props {
  /** The «Параметри / Націнки ЗІЗ» switch shown under the header. */
  tabs: ReactNode;
}

const distinct = (values: string[]) => [...new Set(values)];

export function PricingParametersContent({ tabs }: Props) {
  const { canCreate } = usePageRights();
  const {
    rows,
    loading,
    error,
    reload,
    search,
    setSearch,
    section,
    setSection,
    active,
    setActive,
    actionMessage,
    setActionMessage,
    deletion,
    sections,
    filteredRows,
  } = usePricingParametersContent();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Параметри ціноутворення"
        subtitle="Зарплата, робочий час, коефіцієнти та націнки, з яких Brevi рахує ціни"
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
                onClick={() => setActive({ mode: 'create', parameter: null })}
              >
                Додати параметр
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
        placeholder="Знайти параметр за назвою, кодом або групою"
        label="Пошук параметрів"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <PricingSectionChips
            sections={sections}
            total={rows.length}
            value={section}
            onChange={setSection}
          />
        }
        count={filteredRows.length}
        total={rows.length}
        countLabel="Кількість параметрів"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <PricingParametersGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(parameter) => setActive({ mode: 'view', parameter })}
          onEdit={(parameter) => setActive({ mode: 'edit', parameter })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <PricingParameterDrawer
          key={`${active.mode}-${active.parameter?.id ?? 'new'}`}
          mode={active.mode}
          parameter={active.parameter}
          newSortOrder={nextSortOrder(rows)}
          groups={distinct(rows.map((row) => row.group))}
          units={distinct(rows.map((row) => row.unit))}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Параметр збережено.');
          }}
        />
      )}
      <PricingDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        what="параметрів"
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

import { useDeletePricingParameterMutation } from '@admin/references/data-access';
import { filterPricingParameters, listPricingParameterSections } from '@admin/references/model';
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
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { PricingParameterDrawer } from '../../components/pricing-parameters/pricing-parameter-drawer';
import { nextSortOrder, usePricingParameters } from '../../hooks/pricing-parameters/use-pricing-lists';
import { useReferenceDeletion } from '../../hooks/reference-lists/use-reference-deletion';

import type {
  PricingEditorMode,
  PricingParameter,
  PricingParameterSectionFilter,
} from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The «Параметри / Націнки ЗІЗ» switch shown under the header. */
  tabs: ReactNode;
}

const distinct = (values: string[]) => [...new Set(values)];

export function PricingParametersContent({ tabs }: Props) {
  const { rows, loading, error, reload } = usePricingParameters();
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<PricingParameterSectionFilter>(null);
  const [active, setActive] = useState<{
    mode: PricingEditorMode;
    parameter: PricingParameter | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteParameter] = useDeletePricingParameterMutation();
  const deletion = useReferenceDeletion((id) => deleteParameter(id).unwrap(), setActionMessage);
  const sections = useMemo(() => listPricingParameterSections(rows), [rows]);
  const filteredRows = useMemo(
    () => filterPricingParameters(rows, search, section),
    [rows, search, section],
  );

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
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActive({ mode: 'create', parameter: null })}
            >
              Додати параметр
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

import { useDeleteFabricColorMutation } from '@admin/references/data-access';
import { filterFabricColors } from '@admin/references/model';
import {
  FabricColorDeleteDialog,
  FabricColorsGrid,
  ReferenceBulkDeleteButton,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { FabricColorDrawer } from '../../components/fabric-colors/fabric-color-drawer';
import { useFabricColors } from '../../hooks/fabric-colors/use-fabric-colors';
import { nextSortOrder } from '../../hooks/pricing-parameters/use-pricing-lists';
import { useReferenceDeletion } from '../../hooks/reference-lists/use-reference-deletion';

import type { FabricColor, PricingEditorMode } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  tabs: ReactNode;
}

/** Tab «Кольори»: the sheet colours list; the workshop picks item and stock colours only from it. */
export function FabricColorsContent({ tabs }: Props) {
  const { rows, loading, error, reload } = useFabricColors();
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<{
    mode: PricingEditorMode;
    color: FabricColor | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteColor] = useDeleteFabricColorMutation();
  const deletion = useReferenceDeletion((id) => deleteColor(id).unwrap(), setActionMessage);
  const filteredRows = useMemo(() => filterFabricColors(rows, search), [rows, search]);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Тканини та фурнітура"
        subtitle="Кольори: цех обирає колір позиції, приходу й складу лише з цього списку"
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
              onClick={() => setActive({ mode: 'create', color: null })}
            >
              Додати колір
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
        placeholder="Знайти колір за назвою"
        label="Пошук кольорів"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={null}
        count={filteredRows.length}
        total={rows.length}
        countLabel="Кількість кольорів"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FabricColorsGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(color) => setActive({ mode: 'view', color })}
          onEdit={(color) => setActive({ mode: 'edit', color })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <FabricColorDrawer
          key={`${active.mode}-${active.color?.id ?? 'new'}`}
          mode={active.mode}
          color={active.color}
          others={rows}
          newSortOrder={nextSortOrder(rows)}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Колір збережено.');
          }}
        />
      )}
      <FabricColorDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

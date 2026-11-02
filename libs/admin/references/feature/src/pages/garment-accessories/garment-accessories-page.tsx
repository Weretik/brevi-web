import { countByActivity, filterGarmentAccessories } from '@admin/references/model';
import {
  GarmentAccessoriesGrid,
  GarmentAccessoryDeleteDialog,
  ReferenceListToolbar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { GarmentAccessoryDrawer } from '../../components/garment-accessories/garment-accessory-drawer';
import { ReferencePageHeader } from '../../components/reference-list/reference-page-header';
import { useGarmentAccessories } from '../../hooks/garment-accessories/use-garment-accessories';
import { useGarmentAccessoryDeletion } from '../../hooks/garment-accessories/use-garment-accessory-deletion';

import type { GarmentAccessoryEditorMode } from '../../hooks/garment-accessories/use-garment-accessory-editor';
import type { GarmentAccessory, ReferenceActivityFilter } from '@admin/references/model';

export function GarmentAccessoriesPage() {
  const { rows, loading, error, reload } = useGarmentAccessories();
  const [active, setActive] = useState<{
    mode: GarmentAccessoryEditorMode;
    accessory: GarmentAccessory | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activity, setActivity] = useState<ReferenceActivityFilter>('active');
  const filteredRows = useMemo(
    () => filterGarmentAccessories(rows, search, activity),
    [rows, search, activity],
  );
  const activityCounts = useMemo(() => countByActivity(rows), [rows]);
  const {
    selection,
    setSelection,
    selectedIds,
    pendingDeleteIds,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useGarmentAccessoryDeletion(setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Фурнітура"
        subtitle="Нитки, блискавки, кнопки та послуги з цінами за одиницю для калькуляції"
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            disabled={loading || Boolean(error)}
            onClick={() => setActive({ mode: 'create', accessory: null })}
          >
            Додати фурнітуру
          </Button>
        }
      />
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
        <ReferenceListToolbar
          searchPlaceholder="Код, назва, постачальник"
          searchLabel="Пошук фурнітури"
          countLabel="Кількість фурнітури"
          activityLabels={{ active: 'Активні', inactive: 'Не використовуються', all: 'Усі' }}
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
        <GarmentAccessoriesGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={selection}
          onSelectionChange={setSelection}
          onView={(accessory) => setActive({ mode: 'view', accessory })}
          onEdit={(accessory) => setActive({ mode: 'edit', accessory })}
          onDelete={(id) => requestDelete([id])}
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
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </Box>
  );
}

export default GarmentAccessoriesPage;

import { countByActivity, filterFabrics } from '@admin/references/model';
import { FabricDeleteDialog, FabricsGrid, ReferenceListToolbar } from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { FabricDrawer } from '../../components/fabrics/fabric-drawer';
import { ReferencePageHeader } from '../../components/reference-list/reference-page-header';
import { useFabricDeletion } from '../../hooks/fabrics/use-fabric-deletion';
import { useFabrics } from '../../hooks/fabrics/use-fabrics';

import type { FabricEditorMode } from '../../hooks/fabrics/use-fabric-editor';
import type { Fabric, ReferenceActivityFilter } from '@admin/references/model';

export function FabricsPage() {
  const { rows, loading, error, reload } = useFabrics();
  const [active, setActive] = useState<{ mode: FabricEditorMode; fabric: Fabric | null } | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activity, setActivity] = useState<ReferenceActivityFilter>('active');
  const filteredRows = useMemo(
    () => filterFabrics(rows, search, activity),
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
  } = useFabricDeletion(setActionMessage);
  const nextId = rows.reduce((largest, row) => Math.max(largest, row.id), 0) + 1;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Тканини"
        subtitle="Ціни за 1 метр, постачальники, склад і щільність для калькуляції та КП"
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            disabled={loading || Boolean(error)}
            onClick={() => setActive({ mode: 'create', fabric: null })}
          >
            Додати тканину
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
          searchPlaceholder="Код, назва, постачальник, склад"
          searchLabel="Пошук тканин"
          countLabel="Кількість тканин"
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
        <FabricsGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={selection}
          onSelectionChange={setSelection}
          onView={(fabric) => setActive({ mode: 'view', fabric })}
          onEdit={(fabric) => setActive({ mode: 'edit', fabric })}
          onDelete={(id) => requestDelete([id])}
        />
      </Paper>
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
        ids={pendingDeleteIds}
        deleting={deleting}
        onClose={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </Box>
  );
}

export default FabricsPage;

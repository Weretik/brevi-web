import { useImportFabricNormsMutation } from '@admin/production/data-access';
import {
  countFabricNorms,
  filterFabricNorms,
  parseFabricNormImportFile,
} from '@admin/production/model';
import {
  FabricNormFilterChips,
  FabricNormsGrid,
  ProductionConfirmDialog,
} from '@admin/production/ui';
import {
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { FabricNormDrawer } from '../../components/norms/fabric-norm-drawer';
import { useFabricNormDeletion } from '../../hooks/norms/use-fabric-norm-deletion';
import { useFabricNorms } from '../../hooks/norms/use-fabric-norms';

import type { FabricNormFilter, FabricNormRow } from '@admin/production/model';

/** «Швейний цех › Норми витрати тканини»: metres per item of every sewing model from «Товари». */
export function FabricNormsPage() {
  const { rows, loading, error, reload } = useFabricNorms();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FabricNormFilter>(null);
  const [active, setActive] = useState<{ mode: 'view' | 'edit'; row: FabricNormRow } | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const deletion = useFabricNormDeletion(setMessage);
  const [importNorms] = useImportFabricNormsMutation();
  const filtered = useMemo(() => filterFabricNorms(rows, search, filter), [rows, search, filter]);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Норми витрати тканини"
        subtitle="Скільки метрів тканини йде на один виріб. Моделі беруться з «Товари»"
        actions={
          <Button
            variant="outlined"
            startIcon={<UploadFileOutlinedIcon />}
            disabled={loading || Boolean(error)}
            onClick={() => setImporting(true)}
          >
            Імпорт
          </Button>
        }
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти модель за кодом або назвою"
        label="Пошук моделей"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <FabricNormFilterChips
            total={rows.length}
            counts={countFabricNorms(rows)}
            value={filter}
            onChange={setFilter}
          />
        }
        count={filtered.length}
        total={rows.length}
        countLabel="Кількість моделей"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <FabricNormsGrid
          rows={filtered}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          onView={(row) => setActive({ mode: 'view', row })}
          onEdit={(row) => setActive({ mode: row.modelName ? 'edit' : 'view', row })}
          onDelete={deletion.request}
        />
      </Paper>
      {active && (
        <FabricNormDrawer
          key={`${active.mode}-${active.row.modelCode}`}
          mode={active.mode}
          row={active.row}
          onClose={() => setActive(null)}
          onSaved={() => {
            setMessage(`Норму ${active.row.modelCode} збережено.`);
            setActive(null);
          }}
        />
      )}
      {importing && (
        <ProductionImportDrawer
          title="Імпорт норм тканини"
          description="Файл fabric-norms.json зі старого «Цеху», у метрах. Спершу перевіримо, потім збережемо."
          keyLabel="Код"
          detailLabel="Модель"
          parse={parseFabricNormImportFile}
          send={(importRows, dryRun) => importNorms({ rows: importRows, dryRun }).unwrap()}
          onClose={() => setImporting(false)}
        />
      )}
      <ProductionConfirmDialog
        open={deletion.pending !== null}
        title="Видалити норму?"
        text={`Норма ${deletion.pending?.modelCode ?? ''} зникне. Модель у «Товари» залишиться.`}
        confirmLabel="Видалити"
        danger
        busy={deletion.busy}
        onClose={deletion.cancel}
        onConfirm={() => void deletion.confirm()}
      />
    </Box>
  );
}

export default FabricNormsPage;

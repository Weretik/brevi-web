import { useImportFabricNormsMutation } from '@admin/production/data-access';
import {
  countFabricNorms,
  filterFabricNorms,
  parseBatchSize,
  parseFabricNormImportFile,
} from '@admin/production/model';
import {
  FabricNormFilterChips,
  FabricNormModelList,
  ModelWorkCard,
  ProductionConfirmDialog,
} from '@admin/production/ui';
import {
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { FabricNormDrawer } from '../../components/norms/fabric-norm-drawer';
import { useFabricNormDeletion } from '../../hooks/norms/use-fabric-norm-deletion';
import { useFabricNorms } from '../../hooks/norms/use-fabric-norms';
import { useModelCompositions } from '../../hooks/norms/use-model-compositions';

import type { FabricNormFilter, FabricNormRow } from '@admin/production/model';

/**
 * «Швейний цех › Норми витрати тканини»: the list of models on the left and the work card of the
 * chosen model (`?model=MOD-052`) on the right: fabric per item for one, two and three colours,
 * lining and insulation, the rest of the composition from «Товари», and a batch count.
 */
export function FabricNormsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rows, loading, error, reload } = useFabricNorms();
  const compositions = useModelCompositions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FabricNormFilter>(null);
  const [batchText, setBatchText] = useState('');
  const [editing, setEditing] = useState<FabricNormRow | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const deletion = useFabricNormDeletion(setMessage);
  const [importNorms] = useImportFabricNormsMutation();
  const filtered = useMemo(() => filterFabricNorms(rows, search, filter), [rows, search, filter]);

  const requested = searchParams.get('model');
  const selected = filtered.find((row) => row.modelCode === requested) ?? filtered[0] ?? null;
  const composition = selected
    ? compositions.rows.find((model) => model.modelCode === selected.modelCode)
    : undefined;
  const batchSize = parseBatchSize(batchText);

  const select = (row: FabricNormRow) =>
    setSearchParams({ model: row.modelCode }, { replace: true });

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Норми витрати тканини"
        subtitle="Скільки тканини, підкладки й утеплювача йде на один виріб і на партію"
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
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '340px minmax(0, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <ReferenceSearchBar
            placeholder="Модель або MOD"
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
          <FabricNormModelList
            rows={filtered}
            selectedCode={selected?.modelCode ?? null}
            loading={loading}
            emptyLabel={
              rows.length === 0 ? 'Швейних моделей у «Товари» поки немає.' : 'Моделей не знайдено.'
            }
            onSelect={select}
          />
        </Box>
        {selected ? (
          <ModelWorkCard
            row={selected}
            composition={composition}
            compositionLoading={compositions.loading}
            compositionError={compositions.error}
            batchText={batchText}
            batchSize={batchSize}
            onBatchChange={setBatchText}
            onEdit={selected.modelName ? () => setEditing(selected) : null}
            onDelete={selected.norm ? () => deletion.request(selected) : null}
          />
        ) : (
          !loading &&
          !error && (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              Виберіть модель у списку.
            </Typography>
          )
        )}
      </Box>
      {editing && (
        <FabricNormDrawer
          key={editing.modelCode}
          row={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setMessage(`Норму ${editing.modelCode} збережено.`);
            setEditing(null);
          }}
        />
      )}
      {importing && (
        <ProductionImportDrawer
          title="Імпорт норм тканини"
          description="Файл норм (fabric-norms….json) у метрах. Спершу перевіримо, потім збережемо."
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

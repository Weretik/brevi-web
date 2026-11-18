import { parseFabricNormImportFile } from '@admin/production/model';
import { ModelWorkCard, ProductionConfirmDialog } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, Typography } from '@mui/material';

import { FabricNormModelColumn } from './fabric-norm-model-column';
import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { FabricNormDrawer } from '../../components/norms/fabric-norm-drawer';
import { useFabricNormsPage } from '../../hooks/norms/use-fabric-norms-page';

/**
 * «Швейний цех › Норми витрати тканини»: the list of models on the left and the work card of the
 * chosen model (`?model=MOD-052`) on the right: fabric per item for one, two and three colours,
 * lining and insulation, the rest of the composition from «Товари», and a batch count.
 */
export function FabricNormsPage() {
  const rights = usePageRights();
  const { canCreate } = rights;
  const page = useFabricNormsPage();
  const {
    loading,
    error,
    reload,
    compositions,
    batchText,
    setBatchText,
    editing,
    setEditing,
    importing,
    setImporting,
    message,
    setMessage,
    deletion,
    importNorms,
    selected,
    composition,
    batchSize,
  } = page;
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Норми витрати тканини"
        subtitle="Скільки тканини, підкладки й утеплювача йде на один виріб і на партію"
        actions={
          canCreate ? (
            <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setImporting(true)}
            >
              Імпорт
            </Button>
          ) : null
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
        <FabricNormModelColumn page={page} />
        {selected ? (
          <ModelWorkCard
            row={selected}
            composition={composition}
            compositionLoading={compositions.loading}
            compositionError={compositions.error}
            batchText={batchText}
            batchSize={batchSize}
            onBatchChange={setBatchText}
            onEdit={selected.modelName && rights.canEdit ? () => setEditing(selected) : null}
            onDelete={selected.norm && rights.canDelete ? () => deletion.request(selected) : null}
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

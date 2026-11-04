import {
  useImportProductionOrdersMutation,
  useImportProductionProgressMutation,
} from '@admin/production/data-access';
import {
  parseProductionOrderImportFile,
  parseProductionProgressImportFile,
  productionStageLabels,
  productionStages,
} from '@admin/production/model';
import { ProductionOrderChips, ProductionOrdersGrid } from '@admin/production/ui';
import {
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, Button, MenuItem, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { useProductionOrders } from '../../hooks/orders/use-production-orders';
import { useProductionOrdersExport } from '../../hooks/orders/use-production-orders-export';

import type { ProductionOrderActor, ProductionStage } from '@admin/production/model';

interface Props {
  useOrderActor: () => ProductionOrderActor;
}

/** «Швейний цех › Виробничі завдання»: what the workshop sews, made from sent КП. */
export function ProductionOrdersPage({ useOrderActor }: Props) {
  const actor = useOrderActor();
  const navigate = useNavigate();
  const list = useProductionOrders();
  const [message, setMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState<'orders' | 'progress' | null>(null);
  const exporter = useProductionOrdersExport(setMessage);
  const [importOrders] = useImportProductionOrdersMutation();
  const [importProgress] = useImportProductionProgressMutation();
  const page = list.page;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Виробничі завдання"
        subtitle="Що шиє цех: завдання створюється з відправленого КП"
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              disabled={exporter.busy || !page || page.total === 0}
              onClick={() => void exporter.run(list.query, list.today)}
            >
              Експорт
            </Button>
            {actor.canImport && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileOutlinedIcon />}
                  onClick={() => setImporting('orders')}
                >
                  Імпорт
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileOutlinedIcon />}
                  onClick={() => setImporting('progress')}
                >
                  Імпорт етапів
                </Button>
              </>
            )}
            {actor.canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/production/orders/new')}
              >
                Нове завдання
              </Button>
            )}
          </>
        }
      />
      <ReferenceListAlerts
        error={list.error}
        loading={list.loading}
        onRetry={() => void list.reload()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти за номером, клієнтом, КП або моделлю"
        label="Пошук завдань"
        value={list.search}
        onChange={list.setSearch}
      />
      <ReferenceFilterRow
        filters={
          <>
            <ProductionOrderChips
              counts={page?.counts ?? { all: 0, new: 0, closed: 0, cancelled: 0 }}
              status={list.status}
              overdue={list.overdue}
              onStatusChange={list.setStatus}
              onOverdueChange={list.setOverdue}
            />
            <TextField
              select
              size="small"
              label="Етап"
              value={list.stage ?? ''}
              sx={{ minWidth: 200 }}
              onChange={(event) =>
                list.setStage((event.target.value || null) as ProductionStage | null)
              }
            >
              <MenuItem value="">Усі</MenuItem>
              {productionStages.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {productionStageLabels[stage]}
                </MenuItem>
              ))}
            </TextField>
            {page && page.managers.length > 1 && (
              <TextField
                select
                size="small"
                label="Менеджер"
                value={list.manager ?? ''}
                sx={{ minWidth: 180 }}
                onChange={(event) => list.setManager(event.target.value || null)}
              >
                <MenuItem value="">Усі</MenuItem>
                {page.managers.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </>
        }
        count={page?.total ?? 0}
        total={page?.counts.all ?? 0}
        countLabel="Кількість завдань"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ProductionOrdersGrid
          rows={page?.items ?? []}
          rowCount={page?.total ?? 0}
          loading={list.loading}
          searching={(page?.counts.all ?? 0) > 0}
          today={list.today}
          paginationModel={list.pagination}
          onPaginationModelChange={list.setPagination}
          onOpen={(row) => navigate(`/production/orders/${row.id}`)}
        />
      </Paper>
      {importing === 'progress' && (
        <ProductionImportDrawer
          title="Імпорт етапів"
          description="Файл production-progress.json зі старого «Цеху»: етапи позицій, посилання на файли і відмітки Telegram. Спершу перевіримо, потім збережемо."
          keyLabel="Завдання"
          detailLabel="Що зміниться"
          parse={parseProductionProgressImportFile}
          send={(rows, dryRun) => importProgress({ rows, dryRun }).unwrap()}
          onClose={() => setImporting(null)}
        />
      )}
      {importing === 'orders' && (
        <ProductionImportDrawer
          title="Імпорт завдань"
          description="Файл production-orders.json зі старого «Цеху». Спершу перевіримо, потім збережемо."
          keyLabel="Номер"
          detailLabel="Клієнт"
          parse={parseProductionOrderImportFile}
          send={(rows, dryRun) => importOrders({ rows, dryRun }).unwrap()}
          onClose={() => setImporting(null)}
        />
      )}
    </Box>
  );
}

export default ProductionOrdersPage;

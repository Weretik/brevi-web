import {
  useImportProductionOrdersMutation,
  useImportProductionProgressMutation,
  useImportProductionReportPricesMutation,
} from '@admin/production/data-access';
import {
  parseProductionOrderImportFile,
  parseProductionProgressImportFile,
  parseProductionReportPriceImportFile,
  ordersWord,
} from '@admin/production/model';
import {
  ModelSummarySortEditor,
  ProductionModelSummaryTable,
  ProductionOrderChips,
  ProductionOrderFilterChips,
  ProductionOrderFilterPanel,
  ProductionOrdersGrid,
  ProductionOrdersMoreMenu,
  ProductionStageConveyor,
  countProductionOrderFilters,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Alert,
  Badge,
  Box,
  Button,
  Collapse,
  LinearProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ProductionImportDrawer } from '../../components/import/production-import-drawer';
import { ProductionOrderQuickPanel } from '../../components/orders/production-order-quick-panel';
import { useProductionModelSummary } from '../../hooks/orders-list/use-production-model-summary';
import { useProductionOrders } from '../../hooks/orders-list/use-production-orders';
import { useProductionOrdersExport } from '../../hooks/orders-list/use-production-orders-export';

import type { ProductionOrderActor } from '@admin/production/model';
import type { ProductionOrdersImport } from '@admin/production/ui';

interface Props {
  useOrderActor: () => ProductionOrderActor;
}

type OrdersView = 'list' | 'summary';

/**
 * «Швейний цех › Виробничі завдання»: what the workshop sews, made from КП. The stage «конвеєр» shows the open
 * orders by stage and filters the list (a stage keeps the list on «Нові»); «Прострочені» and «Термін горить» chips
 * appear only when there are such orders. A row opens the order in a side panel (`?order=`). «Фільтри» narrow
 * both the list and «Зведення за моделями»; «Переглянути» in the summary opens the list of that model. The one-time
 * transfers from the old «Цех» live in «⋯».
 */
export function ProductionOrdersPage({ useOrderActor }: Props) {
  const actor = useOrderActor();
  const { canCreate } = usePageRights();
  const navigate = useNavigate();
  const list = useProductionOrders();
  const [view, setView] = useState<OrdersView>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const summary = useProductionModelSummary(list.query, view === 'summary');
  const [message, setMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState<ProductionOrdersImport | null>(null);
  const exporter = useProductionOrdersExport(setMessage);
  const [importOrders] = useImportProductionOrdersMutation();
  const [importProgress] = useImportProductionProgressMutation();
  const [importPrices] = useImportProductionReportPricesMutation();
  const page = list.page;
  const panelFilters = countProductionOrderFilters(list.filters, list.manager);
  const attention = page?.attention ?? { overdue: 0, dueSoon: 0 };
  const [params, setParams] = useSearchParams();
  const quickId = Number(params.get('order')) || null;
  const setQuick = (id: number | null) =>
    setParams(
      (current) => {
        const copy = new URLSearchParams(current);
        if (id === null) copy.delete('order');
        else copy.set('order', String(id));
        return copy;
      },
      { replace: id === null },
    );

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Виробничі завдання"
        subtitle="Що шиє цех: завдання створюється з КП під запит"
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
            {actor.canImport && canCreate && <ProductionOrdersMoreMenu onImport={setImporting} />}
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
      <ProductionStageConveyor
        stages={page?.stages ?? []}
        selected={list.stage}
        onSelect={list.setStage}
      />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 1, alignItems: { md: 'flex-start' }, '& > .MuiTextField-root': { mb: 0 } }}
      >
        <ReferenceSearchBar
          placeholder="Номер завдання або КП, клієнт, модель"
          label="Пошук завдань"
          value={list.search}
          onChange={list.setSearch}
        />
        <Stack direction="row" sx={{ gap: 1, flexShrink: 0 }}>
          <Badge badgeContent={panelFilters} color="primary">
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              aria-haspopup="dialog"
              onClick={() => setFiltersOpen(true)}
              sx={{ height: 48, bgcolor: 'background.paper' }}
            >
              Фільтри
            </Button>
          </Badge>
          <ToggleButtonGroup
            exclusive
            value={view}
            aria-label="Вигляд"
            onChange={(_event, next: OrdersView | null) => next && setView(next)}
            sx={{ height: 48, bgcolor: 'background.paper' }}
          >
            <ToggleButton value="list">Список</ToggleButton>
            <ToggleButton value="summary">Зведення за моделями</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center', my: 1.5 }}
        aria-label="Відбір завдань"
        role="group"
      >
        <ProductionOrderChips
          counts={page?.counts ?? { all: 0, new: 0, closed: 0, cancelled: 0 }}
          status={list.urgency ? undefined : list.status}
          overdue={list.urgency === 'overdue'}
          overdueCount={attention.overdue}
          dueSoon={list.urgency === 'dueSoon'}
          dueSoonCount={attention.overdue + attention.dueSoon}
          onStatusChange={list.setStatus}
          onOverdueChange={(on) => list.setUrgency(on ? 'overdue' : null)}
          onDueSoonChange={(on) => list.setUrgency(on ? 'dueSoon' : null)}
        />
        <ProductionOrderFilterChips
          values={list.filters}
          options={list.filterOptions}
          manager={list.manager}
          stage={list.stage}
          onChange={list.setFilter}
          onManagerChange={list.setManager}
          onStageChange={list.setStage}
        />
        <Box sx={{ flexGrow: 1 }} />
        {page && (
          <Typography variant="body2" color="text.secondary" aria-live="polite">
            Знайдено {page.total} {ordersWord(page.total)}
          </Typography>
        )}
      </Stack>
      {view === 'list' ? (
        <ProductionOrdersGrid
          rows={page?.items ?? []}
          rowCount={page?.total ?? 0}
          loading={list.loading}
          searching={(page?.counts.all ?? 0) > 0}
          today={list.today}
          paginationModel={list.pagination}
          onPaginationModelChange={list.setPagination}
          onOpen={(row) => setQuick(row.id)}
          sort={list.sort}
          onSortChange={list.setSort}
        />
      ) : (
        <Stack spacing={1.5}>
          <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
            <Button
              size="small"
              aria-expanded={sortOpen}
              endIcon={sortOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setSortOpen(!sortOpen)}
            >
              Сортування за пріоритетом ({summary.sort.length})
            </Button>
            <Collapse in={sortOpen} unmountOnExit>
              <Box sx={{ pt: 1, pb: 1 }}>
                <ModelSummarySortEditor levels={summary.sort} onChange={summary.setSort} />
              </Box>
            </Collapse>
          </Paper>
          {summary.error && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => void summary.reload()}>
                  Повторити
                </Button>
              }
            >
              {summary.error}
            </Alert>
          )}
          {summary.loading && <LinearProgress aria-label="Завантаження зведення" />}
          {!summary.loading && !summary.error && (
            <ProductionModelSummaryTable
              rows={summary.rows}
              totalQuantity={summary.totalQuantity}
              onView={(row) => {
                list.setFilter('model', row.modelCode);
                setView('list');
              }}
            />
          )}
        </Stack>
      )}
      {quickId !== null && (
        <ProductionOrderQuickPanel orderId={quickId} onClose={() => setQuick(null)} />
      )}
      <ProductionOrderFilterPanel
        open={filtersOpen}
        values={list.filters}
        options={list.filterOptions}
        manager={list.manager}
        managers={page?.managers ?? []}
        count={page?.total ?? 0}
        onChange={list.setFilter}
        onManagerChange={list.setManager}
        onReset={list.resetFilters}
        onClose={() => setFiltersOpen(false)}
      />
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
      {importing === 'prices' && (
        <ProductionImportDrawer
          title="Ціни КП"
          description="Файл production-report-prices.json: ціни КП для завдань зі старого «Цеху», щоб «Звіти цеху» рахували вартість випуску. Ціну отримає лише позиція без ціни. Спершу перевіримо, потім збережемо."
          keyLabel="Завдання"
          detailLabel="Що зміниться"
          parse={parseProductionReportPriceImportFile}
          send={(rows, dryRun) => importPrices({ rows, dryRun }).unwrap()}
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

import { countProductionOrderFilters } from '@admin/production/model';
import {
  ProductionOrderFilterPanel,
  ProductionOrdersGrid,
  ProductionOrdersMoreMenu,
  ProductionOrdersSearchRow,
  ProductionStageConveyor,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ProductionOrdersSelection } from './production-orders-selection';
import { ProductionOrdersImportDrawers } from '../../components/import/production-orders-import-drawers';
import { ProductionModelSummaryView } from '../../components/orders/list/production-model-summary-view';
import { ProductionOrderQuickPanel } from '../../components/orders/list/production-order-quick-panel';
import { useProductionOrdersPage } from '../../hooks/orders-list/use-production-orders-page';

import type { ProductionOrderActor } from '@admin/production/model';

interface Props {
  useOrderActor: () => ProductionOrderActor;
}

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
  const {
    list,
    view,
    setView,
    filtersOpen,
    setFiltersOpen,
    summary,
    message,
    setMessage,
    importing,
    setImporting,
    exporter,
    quick,
    page,
    attention,
  } = useProductionOrdersPage();
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
      <ProductionOrdersSearchRow
        search={list.search}
        onSearchChange={list.setSearch}
        filterCount={countProductionOrderFilters(list.filters, list.manager)}
        onOpenFilters={() => setFiltersOpen(true)}
        view={view}
        onViewChange={setView}
      />
      <ProductionOrdersSelection list={list} page={page} attention={attention} />
      {view === 'list' ? (
        <ProductionOrdersGrid
          rows={page?.items ?? []}
          rowCount={page?.total ?? 0}
          loading={list.loading}
          searching={(page?.counts.all ?? 0) > 0}
          today={list.today}
          paginationModel={list.pagination}
          onPaginationModelChange={list.setPagination}
          onOpen={(row) => quick.open(row.id)}
          sort={list.sort}
          onSortChange={list.setSort}
          modelCode={list.filters.model}
        />
      ) : (
        <ProductionModelSummaryView
          summary={summary}
          onView={(row) => {
            list.setFilter('model', row.modelCode);
            setView('list');
          }}
        />
      )}
      {quick.orderId !== null && (
        <ProductionOrderQuickPanel orderId={quick.orderId} onClose={quick.close} />
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
      <ProductionOrdersImportDrawers kind={importing} onClose={() => setImporting(null)} />
    </Box>
  );
}

export default ProductionOrdersPage;

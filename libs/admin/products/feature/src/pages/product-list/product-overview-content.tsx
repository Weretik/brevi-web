import { useDeleteProductMutation } from '@admin/products/data-access';
import {
  ProductOverviewDeleteDialog,
  ProductOverviewGrid,
  ProductOverviewSectionChips,
  SewingRecalculationDialog,
} from '@admin/products/ui';
import { useReferenceDeletion } from '@admin/references/feature';
import {
  ReferenceBulkDeleteButton,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { Alert, Box, Button, CircularProgress, Paper } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ProductOverviewDrawer } from '../../components/product-overview/product-overview-drawer';
import { useProductListRows } from '../../hooks/product-overview/use-product-list-rows';
import { useProductOverview } from '../../hooks/product-overview/use-product-overview';
import { useSewingRecalculation } from '../../hooks/product-overview/use-sewing-recalculation';

import type { ProductOverviewEditorMode } from '../../hooks/product-overview/use-product-overview-editor';
import type { ProductListRow, ProductOverview, ProductOverviewType } from '@admin/products/model';
import type { ReactNode } from 'react';

interface Props {
  type: ProductOverviewType;
  tabs: ReactNode;
}

/** One «Товари» tab: sewing models (sheet «Товари») or PPE (sheet «ЗІЗ»). */
export function ProductOverviewContent({ type, tabs }: Props) {
  const { rows, prices, fabricNames, pricesError, sections, sectionNames, loading, error, reload } =
    useProductOverview(type);
  const sectionIds = useMemo(() => sections.map((item) => item.id), [sections]);
  const list = useProductListRows({ rows, prices, fabricNames, sectionIds });
  const [active, setActive] = useState<{
    mode: ProductOverviewEditorMode;
    row: ProductOverview;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteProduct] = useDeleteProductMutation();
  const deletion = useReferenceDeletion((id) => deleteProduct(id).unwrap(), setActionMessage);
  const recalculation = useSewingRecalculation(setActionMessage);
  const open = (mode: ProductOverviewEditorMode, row: ProductListRow) => {
    if (row.kind === 'model') setActive({ mode, row: row.product });
  };
  const sewing = type === 'Sewing';

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Товари"
        subtitle="Швейна продукція — одна модель в рядку, ЗІЗ — один артикул сайту. Тексти і фото сайту згодом будуть у «Контенті сайту»"
        actions={
          <>
            {sewing && (
              <Button
                variant="outlined"
                startIcon={
                  recalculation.running ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CalculateOutlinedIcon />
                  )
                }
                disabled={recalculation.running || loading}
                onClick={() => recalculation.start(null)}
              >
                {recalculation.running ? 'Рахуємо…' : 'Перерахувати всі'}
              </Button>
            )}
            <ReferenceBulkDeleteButton
              selectedCount={deletion.selectedIds.length}
              disabled={deletion.deleting || loading}
              onDelete={() => deletion.requestDelete(deletion.selectedIds)}
            />
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              component={RouterLink}
              to={sewing ? '/references/products/new/sewing' : '/references/products/new/ppe'}
            >
              {sewing ? 'Додати модель' : 'Додати ЗІЗ'}
            </Button>
          </>
        }
      />
      {tabs}
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={reload}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      {pricesError && <Alert severity="warning">{pricesError}</Alert>}
      <ReferenceSearchBar
        placeholder={
          sewing
            ? 'Знайти модель за ID, назвою, описом або артикулом'
            : 'Знайти ЗІЗ за артикулом, назвою або описом'
        }
        label="Пошук товарів"
        value={list.search}
        onChange={list.setSearch}
      />
      <ReferenceFilterRow
        filters={
          <ProductOverviewSectionChips
            counts={list.counts}
            sectionNames={sectionNames}
            total={rows.length}
            value={list.section}
            onChange={list.setSection}
            withoutPrice={list.withoutPrice}
          />
        }
        count={list.filteredCount}
        total={rows.length}
        countLabel="Кількість товарів"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ProductOverviewGrid
          type={type}
          rows={list.listRows}
          sectionNames={sectionNames}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onToggle={list.toggle}
          onView={(row) => open('view', row)}
          onEdit={(row) => open('edit', row)}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <ProductOverviewDrawer
          key={`${active.mode}-${active.row.id}`}
          mode={active.mode}
          row={active.row}
          sections={sections}
          sectionNames={sectionNames}
          prices={prices.get(active.row.id) ?? null}
          onRecalculate={() => recalculation.start([active.row.id])}
          recalculating={recalculation.running}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Товар збережено.');
          }}
        />
      )}
      <SewingRecalculationDialog
        report={recalculation.report}
        scope={recalculation.scope}
        applying={recalculation.running}
        error={recalculation.error}
        onClose={recalculation.cancel}
        onConfirm={recalculation.confirm}
      />
      <ProductOverviewDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

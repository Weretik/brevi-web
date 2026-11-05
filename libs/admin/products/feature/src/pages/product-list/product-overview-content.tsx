import { useDeleteProductMutation, useGetProductAccessQuery } from '@admin/products/data-access';
import {
  ProductOverviewDeleteDialog,
  ProductOverviewGrid,
  ProductOverviewSectionChips,
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
import { Box, Button, Paper } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ProductOverviewDrawer } from '../../components/product-overview/product-overview-drawer';
import { useProductActiveSwitch } from '../../hooks/product-overview/use-product-active-switch';
import { useProductOverview } from '../../hooks/product-overview/use-product-overview';

import type { ProductOverviewEditorMode } from '../../hooks/product-overview/use-product-overview-editor';
import type { ProductListRow, ProductOverview, ProductOverviewType } from '@admin/products/model';
import type { ReactNode } from 'react';

interface Props {
  type: ProductOverviewType;
  tabs: ReactNode;
}

/** One «Товари» tab: sewing models (sheet «Товари») or PPE (sheet «ЗІЗ»). */
export function ProductOverviewContent({ type, tabs }: Props) {
  const list = useProductOverview(type);
  const { sections, sectionNames, loading, error, reload } = list;
  const [active, setActive] = useState<{
    mode: ProductOverviewEditorMode;
    row: ProductOverview;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteProduct] = useDeleteProductMutation();
  const activeSwitch = useProductActiveSwitch(setActionMessage);
  const access = useGetProductAccessQuery();
  const canManage = access.currentData?.canManage === true;
  const deletion = useReferenceDeletion((id) => deleteProduct(id).unwrap(), setActionMessage);
  const open = (mode: ProductOverviewEditorMode, row: ProductListRow) => {
    if (row.kind === 'model') setActive({ mode, row: row.product });
  };
  const sewing = type === 'Sewing';

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Товари"
        subtitle="Швейна продукція — одна модель в рядку, ЗІЗ — один артикул сайту. Головне фото товару показується тут і в КП"
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
      <ReferenceSearchBar
        placeholder={
          sewing
            ? 'Знайти модель за ID, назвою, описом, артикулом або тканиною'
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
            total={list.all}
            value={list.section}
            onChange={list.setSection}
            withoutPrice={list.withoutPrice}
            activity={list.activity}
          />
        }
        count={list.total}
        total={list.all}
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
          searching={list.all > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onToggle={list.toggle}
          onView={(row) => open('view', row)}
          onEdit={(row) => open('edit', row)}
          onDelete={(id) => deletion.requestDelete([id])}
          onActiveChange={canManage ? activeSwitch.change : undefined}
          activeSavingId={activeSwitch.savingId}
          server={list.server}
        />
      </Paper>
      {active && (
        <ProductOverviewDrawer
          key={`${active.mode}-${active.row.id}`}
          mode={active.mode}
          row={active.row}
          sections={sections}
          sectionNames={sectionNames}
          showPrices
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Товар збережено.');
          }}
        />
      )}
      <ProductOverviewDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}
